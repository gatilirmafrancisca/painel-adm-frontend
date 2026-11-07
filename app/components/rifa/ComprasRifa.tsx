import { useCallback, useEffect, useState } from "react";
import { Download } from "lucide-react";
import { errorNotification } from "../ToasterComponents/ToasterNotifications";
import type { Pedido, StatusPedido } from "../../types/rifa.type";

const STATUS: { valor: StatusPedido | ""; rotulo: string }[] = [
  { valor: "", rotulo: "Todas" },
  { valor: "PAGO", rotulo: "Pagas" },
  { valor: "PAGO_PARCIAL", rotulo: "Pagas, com número a escolher" },
  { valor: "AGUARDANDO_PAGAMENTO", rotulo: "Aguardando pagamento" },
  { valor: "RESERVADO", rotulo: "Escolhendo como pagar" },
  { valor: "EXPIRADO", rotulo: "Venceram sem pagamento" },
  { valor: "CANCELADO", rotulo: "Canceladas" },
];

const COR_STATUS: Record<StatusPedido, string> = {
  PAGO: "bg-[#e3f1e8] text-[#1a5331]",
  PAGO_PARCIAL: "bg-[#fdebd9] text-[#a4520b]",
  AGUARDANDO_PAGAMENTO: "bg-[#eef2f7] text-[#3f5a7d]",
  RESERVADO: "bg-[#eef2f7] text-[#3f5a7d]",
  EXPIRADO: "bg-[#f3f3ef] text-[#5a5a54]",
  CANCELADO: "bg-[#f3f3ef] text-[#5a5a54]",
};

const ROTULO_STATUS: Record<StatusPedido, string> = {
  PAGO: "Paga",
  PAGO_PARCIAL: "Paga · escolher número",
  AGUARDANDO_PAGAMENTO: "Aguardando pagamento",
  RESERVADO: "Escolhendo como pagar",
  EXPIRADO: "Venceu",
  CANCELADO: "Cancelada",
};

export const ROTULO_ALERTA: Record<string, string> = {
  VALOR_DIVERGENTE: "Valor pago diferente do pedido",
  PAGAMENTO_DUPLICADO: "Pago em dobro — estornar",
  PAGO_APOS_EXPIRAR: "Pago depois da reserva vencer",
};

const pad = (n: number) => String(n).padStart(3, "0");
const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const dataHora = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });

/** Baixa a planilha dos números vendidos (a rota exige o token, então não dá pra ser um link simples). */
export async function baixarPlanilha(baseUrl: string) {
  try {
    const response = await fetch(`${baseUrl}/rifa/exportar.csv`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token") ?? ""}` },
    });
    if (!response.ok) {
      errorNotification("Não foi possível gerar a planilha agora.");
      return;
    }
    const url = URL.createObjectURL(await response.blob());
    const link = document.createElement("a");
    link.href = url;
    link.download = `rifa-numeros-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  } catch {
    errorNotification("Erro de conexão ao gerar a planilha.");
  }
}

/**
 * Compras da Ação de Natal (números escolhidos antes de pagar): uma linha por
 * compra, com os números, o valor, Pix/cartão, contato e alertas.
 */
export function ComprasRifa({ baseUrl, busca }: { baseUrl: string; busca: string }) {
  const [status, setStatus] = useState<StatusPedido | "">("");
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const params = new URLSearchParams();
      if (status) params.set("status", status);
      if (busca.trim()) params.set("busca", busca.trim());
      const response = await fetch(`${baseUrl}/rifa/pedidos?${params}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token") ?? ""}` },
      });
      if (!response.ok) {
        setErro("Não foi possível carregar as compras agora.");
        return;
      }
      const payload = await response.json();
      setPedidos(Array.isArray(payload?.data) ? payload.data : []);
    } catch {
      setErro("Erro de conexão ao carregar as compras.");
    } finally {
      setCarregando(false);
    }
  }, [baseUrl, status, busca]);

  useEffect(() => {
    const t = window.setTimeout(() => void carregar(), 250);
    return () => window.clearTimeout(t);
  }, [carregar]);

  const pagas = pedidos.filter((p) => p.status === "PAGO" || p.status === "PAGO_PARCIAL");
  const arrecadado = pagas.reduce((t, p) => t + p.valor, 0);

  return (
    <div className="p-4">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as StatusPedido | "")}
          aria-label="Filtrar compras por situação"
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#368c5e]"
        >
          {STATUS.map((s) => <option key={s.valor} value={s.valor}>{s.rotulo}</option>)}
        </select>
        <p className="text-sm text-[#5a5a54]">
          {pedidos.length} {pedidos.length === 1 ? "compra" : "compras"} · {pagas.length} pagas · {brl(arrecadado)}
        </p>
        <button
          type="button"
          onClick={() => void baixarPlanilha(baseUrl)}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-[#e3e3dd] bg-white px-3 py-2 text-sm font-semibold text-[#1a5331] hover:border-[#368c5e]"
        >
          <Download size={16} /> Planilha dos números
        </button>
      </div>

      {erro && <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p>}

      {carregando && !pedidos.length ? (
        <p className="py-10 text-center text-sm text-gray-500">Carregando compras...</p>
      ) : !pedidos.length ? (
        <p className="py-10 text-center text-sm text-gray-500">Nenhuma compra encontrada.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-[#9a9a92]">
              <tr>
                <th className="px-3 py-2">Quando</th>
                <th className="px-3 py-2">Números</th>
                <th className="px-3 py-2">Quem comprou</th>
                <th className="px-3 py-2">Pagamento</th>
                <th className="px-3 py-2">Situação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#efefea]">
              {pedidos.map((p) => {
                const numeros = p.numerosConfirmados.length ? p.numerosConfirmados : p.numeros;
                return (
                  <tr key={p.pedidoId} className="align-top">
                    <td className="whitespace-nowrap px-3 py-2.5 text-[#5a5a54]">
                      {dataHora(p.criadoEm)}
                      {p.pagoEm && <span className="block text-xs">pago {dataHora(p.pagoEm)}</span>}
                    </td>
                    <td className="px-3 py-2.5 font-bold text-[#1e1b1c]">
                      {numeros.map(pad).join(", ")}
                      {p.numerosAEscolher > 0 && <span className="block text-xs font-semibold text-[#a4520b]">+{p.numerosAEscolher} a escolher</span>}
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="block font-medium text-[#1e1b1c]">{p.nome ?? "—"}</span>
                      <span className="block text-xs text-[#5a5a54]">{[p.email, p.phone].filter(Boolean).join(" · ")}</span>
                    </td>
                    <td className="px-3 py-2.5 text-[#5a5a54]">
                      {brl(p.valor)} · {p.metodo === "pix" ? "Pix" : p.metodo === "cartao" ? "Cartão" : "—"}
                      {p.mpPaymentId && <span className="block text-xs">ID {p.mpPaymentId}</span>}
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${COR_STATUS[p.status]}`}>{ROTULO_STATUS[p.status]}</span>
                      {(p.status === "AGUARDANDO_PAGAMENTO" || p.status === "RESERVADO") && (
                        <span className="mt-1 block text-xs text-[#5a5a54]">até {dataHora(p.expiraEm)}</span>
                      )}
                      {p.alertas.map((a) => (
                        <span key={a} className="mt-1 block text-xs font-semibold text-red-700">⚠ {ROTULO_ALERTA[a] ?? a}</span>
                      ))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
