import { useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp, Copy, Mail } from "lucide-react";
import { errorNotification, successNotification } from "../ToasterComponents/ToasterNotifications";
import type { ContatoPagamento, PendenteEscolha, Reserva, ResumoRifas as Resumo } from "../../types/rifa.type";

interface ResumoRifasProps {
  resumo: Resumo | null;
  isLoading: boolean;
  baseUrl: string;
  /** Recarrega o resumo depois de informar um e-mail. */
  onAtualizado: () => void;
}

type Categoria = "compradas" | "pendentesEscolha" | "reservadas" | "disponiveis";
type ListaAberta = "pendentesEscolha" | "reservadas" | null;

// Verde do painel para o que já está vendido; laranja chama atenção para
// quem precisa escolher; azul acinzentado para o que ainda aguarda pagamento.
const CATEGORIAS: { chave: Categoria; rotulo: string; descricao: string; cor: string }[] = [
  { chave: "compradas", rotulo: "Compradas", descricao: "Pagas e com número escolhido", cor: "#368c5e" },
  { chave: "pendentesEscolha", rotulo: "Pendentes de escolha", descricao: "Pagas, sem número escolhido", cor: "#f08c2e" },
  { chave: "reservadas", rotulo: "Reservadas", descricao: "Pagamento iniciado, aguardando aprovação", cor: "#6b88ad" },
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

/** Selo das reservas: o que de fato está pendente no Mercado Pago. */
function textoReserva(metodo: string | null, criadoEm: string): string {
  if (metodo === "pix") return `Pix gerado ${tempoDesde(criadoEm)}`;
  if (metodo === "cartao") return `Cartão em análise ${tempoDesde(criadoEm)}`;
  return `Aguardando pagamento ${tempoDesde(criadoEm)}`;
}

/** Quem pagou: e-mail ou, sem ele, o nome que veio do Mercado Pago. */
function Identificacao({ item }: { item: ContatoPagamento }) {
  if (item.email) {
    return <p className="truncate font-medium text-[#1e1b1c]">{item.email}</p>;
  }
  return (
    <p className="flex flex-wrap items-center gap-2 font-medium text-[#1e1b1c]">
      <span className="truncate">{item.nomePagador ?? "Sem nome nem e-mail"}</span>
      <span className="rounded-full bg-[#fdebd9] px-2 py-0.5 text-[11px] font-semibold text-[#a4520b]">Sem e-mail</span>
    </p>
  );
}

const botaoAcao =
  "inline-flex items-center gap-1 rounded-md border border-[#e3e3dd] bg-white px-2.5 py-1 text-xs font-semibold text-[#1a5331] transition-colors hover:border-[#368c5e] hover:bg-[#f4faf6]";

/** Campo para informar o e-mail de quem ficou sem — o backend da rifa passa a mandar os lembretes. */
function FormEmail({
  paymentId,
  baseUrl,
  onSalvo,
  onCancelar,
}: {
  paymentId: string;
  baseUrl: string;
  onSalvo: () => void;
  onCancelar: () => void;
}) {
  const [email, setEmail] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    try {
      const response = await fetch(`${baseUrl}/rifa/pagamento/${encodeURIComponent(paymentId)}/email`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
        },
        body: JSON.stringify({ email }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        errorNotification(payload?.message ?? "Não foi possível salvar o e-mail.");
        return;
      }
      successNotification("E-mail salvo. Os lembretes de escolha passam a ir para ele.");
      onSalvo();
    } catch {
      errorNotification("Erro de conexão ao salvar o e-mail.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <form onSubmit={salvar} className="flex w-full flex-wrap items-center gap-2">
      <input
        type="email"
        required
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email@exemplo.com"
        aria-label={`E-mail do pagamento ${paymentId}`}
        className="min-w-[200px] flex-1 rounded-md border border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-[#368c5e] focus:ring-1 focus:ring-[#368c5e]"
      />
      <button
        type="submit"
        disabled={salvando}
        className="rounded-md bg-[#368c5e] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1a5331] disabled:opacity-60"
      >
        {salvando ? "Salvando..." : "Salvar"}
      </button>
      <button type="button" onClick={onCancelar} className="px-2 py-1.5 text-xs font-semibold text-[#5a5a54] hover:underline">
        Cancelar
      </button>
    </form>
  );
}

/** Linha de um pagamento: quem pagou, um selo e as ações de contato. */
function LinhaPagamento({
  item,
  detalhe,
  selo,
  permiteCopiarLink,
  baseUrl,
  onAtualizado,
}: {
  item: ContatoPagamento;
  detalhe: string;
  selo: ReactNode;
  permiteCopiarLink: boolean;
  baseUrl: string;
  onAtualizado: () => void;
}) {
  const [editando, setEditando] = useState(false);

  async function copiarLink() {
    if (!item.linkEscolha) return;
    try {
      await navigator.clipboard.writeText(item.linkEscolha);
      successNotification("Link copiado. Envie para a pessoa escolher o número.");
    } catch {
      window.prompt("Copie o link de escolha:", item.linkEscolha);
    }
  }

  return (
    <li className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 text-sm">
      <div className="min-w-0">
        <Identificacao item={item} />
        <p className="text-xs text-[#9a9a92]">{detalhe}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {permiteCopiarLink && item.linkEscolha && (
          <button type="button" onClick={copiarLink} className={botaoAcao}>
            <Copy size={12} /> Copiar link de escolha
          </button>
        )}
        {!item.email && !editando && (
          <button type="button" onClick={() => setEditando(true)} className={botaoAcao}>
            <Mail size={12} /> Adicionar e-mail
          </button>
        )}
        {selo}
      </div>
      {editando && (
        <FormEmail
          paymentId={item.paymentId}
          baseUrl={baseUrl}
          onCancelar={() => setEditando(false)}
          onSalvo={() => {
            setEditando(false);
            onAtualizado();
          }}
        />
      )}
    </li>
  );
}

function ListaVazia() {
  return <p className="px-4 py-6 text-center text-sm text-[#9a9a92]">Nenhum pagamento nesta situação.</p>;
}

interface ListaProps<T> {
  itens: T[];
  baseUrl: string;
  onAtualizado: () => void;
}

function ListaPendentes({ itens, baseUrl, onAtualizado }: ListaProps<PendenteEscolha>) {
  if (itens.length === 0) return <ListaVazia />;
  return (
    <ul className="divide-y divide-[#efefea]">
      {itens.map((item) => (
        <LinhaPagamento
          key={item.paymentId}
          item={item}
          detalhe={`Pago em ${formatarData(item.pagoEm)} · ID ${item.paymentId}`}
          permiteCopiarLink
          baseUrl={baseUrl}
          onAtualizado={onAtualizado}
          selo={
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                item.diasRestantes <= 5 ? "bg-[#fdebd9] text-[#a4520b]" : "bg-[#f3f3ef] text-[#5a5a54]"
              }`}
              title="Dias até o número ser sorteado para essa pessoa"
            >
              {textoPrazo(item.diasRestantes)}
            </span>
          }
        />
      ))}
    </ul>
  );
}

function ListaReservas({ itens, baseUrl, onAtualizado }: ListaProps<Reserva>) {
  if (itens.length === 0) return <ListaVazia />;
  return (
    <ul className="divide-y divide-[#efefea]">
      {itens.map((item) => (
        <LinhaPagamento
          key={item.paymentId}
          item={item}
          detalhe={`ID ${item.paymentId}`}
          // Ainda não foi pago: o link de escolha não funcionaria.
          permiteCopiarLink={false}
          baseUrl={baseUrl}
          onAtualizado={onAtualizado}
          selo={
            <span className="rounded-full bg-[#eef2f7] px-2.5 py-1 text-xs font-semibold text-[#3f5a7d]">
              {textoReserva(item.metodoPagamento, item.criadoEm)}
            </span>
          }
        />
      ))}
    </ul>
  );
}

/**
 * Situação das 500 vagas da rifa: compradas, pagas aguardando a escolha do
 * número, reservadas (pagamento iniciado e não aprovado) e disponíveis — a
 * mesma conta que o site usa para bloquear a venda.
 */
export function ResumoRifas({ resumo, isLoading, baseUrl, onAtualizado }: ResumoRifasProps) {
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
              : "Pagamento iniciado, aguardando aprovação"}
          </p>
          <div className="max-h-96 overflow-y-auto">
            {listaAberta === "pendentesEscolha" ? (
              <ListaPendentes itens={resumo.listas.pendentesEscolha} baseUrl={baseUrl} onAtualizado={onAtualizado} />
            ) : (
              <ListaReservas itens={resumo.listas.reservadas} baseUrl={baseUrl} onAtualizado={onAtualizado} />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
