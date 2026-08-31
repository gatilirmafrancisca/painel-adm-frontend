import { useCallback, useEffect, useMemo, useState } from "react";
import TabelaRifas from "../components/rifa/TabelaRifas";
import { GradeRifas } from "../components/rifa/GradeRifas";
import { ModalCadastroRifa } from "../components/rifa/ModalCadastroRifa";
import { DetalhesNumeroModal } from "../components/rifa/DetalhesNumeroModal";
import type { Rifa } from "../types/rifa.type";

const BASEURL =
  import.meta.env.VITE_BASE_URL ??
  (typeof window !== "undefined" ? window.location.origin : "http://localhost");

type ModoVisualizacao = "tabela" | "grade";

function normalizarRifa(item: any): Rifa {
  return {
    claimedNumber: Number(item?.claimedNumber),
    name: String(item?.name ?? ""),
    phone: String(item?.phone ?? ""),
    email: String(item?.email ?? ""),
  };
}

const RifaSolidaria: React.FC = () => {
  const [rifas, setRifas] = useState<Rifa[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  const [busca, setBusca] = useState("");
  const [modo, setModo] = useState<ModoVisualizacao>("tabela");

  const [modalCadastroAberto, setModalCadastroAberto] = useState(false);
  const [numeroPrePreenchido, setNumeroPrePreenchido] = useState<number | null>(null);
  const [rifaDetalhes, setRifaDetalhes] = useState<Rifa | null>(null);

  const fetchDados = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setErro("Acesso não autorizado.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErro(null);

    try {
      const response = await fetch(`${BASEURL}/rifa/listar-rifas`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 404) {
        setRifas([]);
        return;
      }

      if (!response.ok) {
        setErro("Não foi possível carregar os números agora.");
        return;
      }

      const payload = await response.json();
      const lista: Rifa[] = Array.isArray(payload?.data)
        ? payload.data.map(normalizarRifa)
        : [];

      setRifas(lista);
    } catch {
      setErro("Erro de conexão ao carregar os números.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDados();
  }, [fetchDados]);

  const rifasFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return rifas;
    return rifas.filter(
      (rifa) =>
        rifa.name.toLowerCase().includes(termo) ||
        String(rifa.claimedNumber).includes(termo) ||
        rifa.phone.includes(termo)
    );
  }, [rifas, busca]);

  const rifasPorNumero = useMemo(() => {
    const mapa = new Map<number, Rifa>();
    for (const rifa of rifas) mapa.set(rifa.claimedNumber, rifa);
    return mapa;
  }, [rifas]);

  function handleRifaCriada(novaRifa: Rifa) {
    setRifas((atual) =>
      [...atual.filter((r) => r.claimedNumber !== novaRifa.claimedNumber), novaRifa].sort(
        (a, b) => a.claimedNumber - b.claimedNumber
      )
    );
  }

  function handleRifaExcluida(claimedNumber: number) {
    setRifas((atual) => atual.filter((r) => r.claimedNumber !== claimedNumber));
  }

  function abrirCadastro(numero: number | null = null) {
    setNumeroPrePreenchido(numero);
    setModalCadastroAberto(true);
  }

  return (
    <div className="relative mx-auto flex h-full max-w-7xl flex-col p-8">
      {/* 1. Topo */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1e1b1c]">Rifa Solidária</h1>
        <button
          onClick={() => abrirCadastro(null)}
          className="rounded-lg bg-[#368c5e] px-5 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-[#1a5331]"
        >
          + Cadastrar número
        </button>
      </div>

      {erro && (
        <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {erro}
        </div>
      )}

      {/* 2. Busca + alternância de visualização */}
      <div className="mb-6 flex flex-wrap items-end gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome, telefone ou número..."
          className="min-w-[260px] flex-1 rounded-lg border border-gray-200 px-3.5 py-2 text-sm text-gray-700 outline-none focus:border-[#368c5e] focus:ring-1 focus:ring-[#368c5e]"
        />

        <div className="flex overflow-hidden rounded-lg border border-gray-200">
          <button
            type="button"
            onClick={() => setModo("tabela")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              modo === "tabela" ? "bg-[#1a5331] text-white" : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Tabela
          </button>
          <button
            type="button"
            onClick={() => setModo("grade")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              modo === "grade" ? "bg-[#1a5331] text-white" : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Grade
          </button>
        </div>
      </div>

      {/* 3. Conteúdo principal */}
      <div className="mb-6 flex-1 overflow-hidden overflow-y-auto rounded-xl border border-gray-100 bg-white shadow-sm">
        {modo === "tabela" ? (
          <TabelaRifas rifas={rifasFiltradas} isLoading={isLoading} onSelecionar={setRifaDetalhes} />
        ) : (
          <GradeRifas
            rifasPorNumero={rifasPorNumero}
            onSelecionarOcupado={setRifaDetalhes}
            onSelecionarDisponivel={(numero) => abrirCadastro(numero)}
          />
        )}
      </div>

      {modalCadastroAberto && (
        <ModalCadastroRifa
          baseUrl={BASEURL}
          numeroInicial={numeroPrePreenchido}
          onClose={() => setModalCadastroAberto(false)}
          onCriado={handleRifaCriada}
        />
      )}

      {rifaDetalhes && (
        <DetalhesNumeroModal
          rifa={rifaDetalhes}
          baseUrl={BASEURL}
          onClose={() => setRifaDetalhes(null)}
          onExcluido={handleRifaExcluida}
        />
      )}
    </div>
  );
};

export default RifaSolidaria;