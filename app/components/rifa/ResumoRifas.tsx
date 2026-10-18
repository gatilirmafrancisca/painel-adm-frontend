import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { PendenteEscolha, Reserva, ResumoRifas as Resumo } from "../../types/rifa.type";

interface ResumoRifasProps {
  resumo: Resumo | null;
  isLoading: boolean;
}

type Categoria = "compradas" | "pendentesEscolha" | "reservadas" | "disponiveis";
type ListaAberta = "pendentesEscolha" | "reservadas" | null;

// Verde do painel para o que já está vendido; laranja chama atenção para
// quem precisa escolher; azul acinzentado para o que ainda aguarda pagamento.
const CATEGORIAS: { chave: Categoria; rotulo: string; descricao: string; cor: string }[] = [
  { chave: "compradas", rotulo: "Compradas", descricao: "Pagas e com número escolhido", cor: "#368c5e" },
  { chave: "pendentesEscolha", rotulo: "Pendentes de escolha", descricao: "Pagas, sem número escolhido", cor: "#f08c2e" },
  { chave: "reservadas", rotulo: "Reservadas", descricao: "Pix gerado, aguardando pagamento", cor: "#6b88ad" },
  { chave: "disponiveis", rotulo: "Disponíveis", descricao: "Livres para venda", cor: "#d9d9d2" },
];

function percentual(valor: number, total: number): string {
  if (!total) return "0%";
  const p = (valor / total) * 100;
  const casas = p > 0 && p < 1 ? 1 : 0;
  return `${p.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas })}%`;
}

function formatarData(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function tempoDesde(iso: string): string {
  const minutos = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60_000));
  if (minutos < 60) return `há ${minutos} min`;
  const horas = Math.round(minutos / 60);
  if (horas < 24) return `há ${horas} h`;
  const dias = Math.round(horas / 24);
  return `há ${dias} ${dias === 1 ? "dia" : "dias"}`;
}

function textoPrazo(dias: number): string {
  if (dias <= 0) return "Sorteio na próxima execução";
  if (dias === 1) return "Último dia para escolher";
  return `Sorteio em ${dias} dias`;
}

function ListaVazia() {
  return <p className="px-4 py-6 text-center text-sm text-[#9a9a92]">Nenhum pagamento nesta situação.</p>;
}

function ListaPendentes({ itens }: { itens: PendenteEscolha[] }) {
  if (itens.length === 0) return <ListaVazia />;
  return (
    <ul className="divide-y divide-[#efefea]">
      {itens.map((item) => (
        <li key={item.paymentId} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-3 text-sm">
          <div className="min-w-0">
            <p className="truncate font-medium text-[#1e1b1c]">{item.email ?? "Sem e-mail"}</p>
            <p className="text-xs text-[#9a9a92]">
              Pago em {formatarData(item.pagoEm)} · ID {item.paymentId}
            </p>
          </div>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
              item.diasRestantes <= 5 ? "bg-[#fdebd9] text-[#a4520b]" : "bg-[#f3f3ef] text-[#5a5a54]"
            }`}
            title="Dias até o número ser sorteado para essa pessoa"
          >
            {textoPrazo(item.diasRestantes)}
          </span>
        </li>
      ))}
    </ul>
  );
}

function ListaReservas({ itens }: { itens: Reserva[] }) {
  if (itens.length === 0) return <ListaVazia />;
  return (
    <ul className="divide-y divide-[#efefea]">
      {itens.map((item) => (
        <li key={item.paymentId} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-3 text-sm">
          <div className="min-w-0">
            <p className="truncate font-medium text-[#1e1b1c]">{item.email ?? "Sem e-mail"}</p>
            <p className="text-xs text-[#9a9a92]">ID {item.paymentId}</p>
          </div>
          <span className="rounded-full bg-[#eef2f7] px-2.5 py-1 text-xs font-semibold text-[#3f5a7d]">
            Pix gerado {tempoDesde(item.criadoEm)}
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Situação das 500 vagas da rifa: compradas, pagas aguardando a escolha do
 * número, reservadas (Pix aguardando pagamento) e disponíveis — a mesma
 * conta que o site usa para bloquear a venda.
 */
export function ResumoRifas({ resumo, isLoading }: ResumoRifasProps) {
  const [listaAberta, setListaAberta] = useState<ListaAberta>(null);

  if (isLoading && !resumo) {
    return (
      <div className="mb-6 rounded-xl border border-gray-100 bg-white p-5 text-sm text-gray-500 shadow-sm">
        Carregando a situação das vagas...
      </div>
    );
  }

  if (!resumo) return null;

  const total = resumo.total || 500;

  function alternar(lista: Exclude<ListaAberta, null>) {
    setListaAberta((atual) => (atual === lista ? null : lista));
  }

  return (
    <section className="mb-6 rounded-xl border border-gray-100 bg-white p-5 shadow-sm" aria-label="Situação das vagas da rifa">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-base font-bold text-[#1e1b1c]">Situação das vagas</h2>
        <p className="text-sm text-[#5a5a54]">
          <span className="font-bold text-[#1e1b1c]">{resumo.disponiveis}</span> de {total} disponíveis
        </p>
      </div>

      {/* Barra empilhada 0–500 */}
      <div
        className="flex h-4 w-full overflow-hidden rounded-full bg-[#d9d9d2]"
        role="img"
        aria-label={CATEGORIAS.map((c) => `${c.rotulo}: ${resumo[c.chave]}`).join(", ")}
      >
        {CATEGORIAS.filter((c) => c.chave !== "disponiveis").map((c) =>
          resumo[c.chave] > 0 ? (
            <div
              key={c.chave}
              style={{ width: `${(resumo[c.chave] / total) * 100}%`, backgroundColor: c.cor, minWidth: 3 }}
              className="h-full border-r-2 border-white last:border-r-0"
              title={`${c.rotulo}: ${resumo[c.chave]}`}
            />
          ) : null
        )}
      </div>

      {/* Cartões */}
      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {CATEGORIAS.map((c) => {
          const valor = resumo[c.chave];
          const clicavel = c.chave === "pendentesEscolha" || c.chave === "reservadas";
          const aberta = listaAberta === c.chave;
          const conteudo = (
            <>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-[#5a5a54]">
                <i className="inline-block h-2.5 w-2.5 flex-none rounded-full" style={{ backgroundColor: c.cor }} />
                {c.rotulo}
              </span>
              <span className="mt-1 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-[#1e1b1c]">{valor}</span>
                <span className="text-xs text-[#9a9a92]">{percentual(valor, total)}</span>
              </span>
              <span className="mt-0.5 flex items-center justify-between gap-1 text-xs text-[#9a9a92]">
                {c.descricao}
                {clicavel && (aberta ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
              </span>
            </>
          );

          return clicavel ? (
            <button
              key={c.chave}
              type="button"
              onClick={() => alternar(c.chave as Exclude<ListaAberta, null>)}
              aria-expanded={aberta}
              className={`flex flex-col rounded-lg border p-3 text-left transition-colors hover:border-[#368c5e] ${
                aberta ? "border-[#368c5e] bg-[#f4faf6]" : "border-[#e3e3dd] bg-white"
              }`}
            >
              {conteudo}
            </button>
          ) : (
            <div key={c.chave} className="flex flex-col rounded-lg border border-[#e3e3dd] bg-white p-3">
              {conteudo}
            </div>
          );
        })}
      </div>

      {listaAberta && (
        <div className="mt-4 overflow-hidden rounded-lg border border-[#e3e3dd]">
          <p className="border-b border-[#efefea] bg-[#fafaf8] px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#5a5a54]">
            {listaAberta === "pendentesEscolha"
              ? "Pagaram e ainda não escolheram o número"
              : "Pix gerado, aguardando pagamento"}
          </p>
          <div className="max-h-80 overflow-y-auto">
            {listaAberta === "pendentesEscolha" ? (
              <ListaPendentes itens={resumo.listas.pendentesEscolha} />
            ) : (
              <ListaReservas itens={resumo.listas.reservadas} />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
