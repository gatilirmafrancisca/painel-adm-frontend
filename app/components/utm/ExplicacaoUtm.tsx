import { useMemo, useState } from "react";
import { Copy, Info } from "lucide-react";
import { INFO_CATEGORIA, UTM_CATEGORIAS, type UtmCategoria, type UtmTag } from "~/types/utm.type";
import { errorNotification, successNotification } from "../ToasterComponents/ToasterNotifications";

const SITE_URL = import.meta.env.VITE_SITE_URL ?? "";

interface ExplicacaoUtmProps {
  tags: UtmTag[];
}

/** O que é cada parâmetro, as regras das tags e um gerador de link com as tags ativas. */
export function ExplicacaoUtm({ tags }: ExplicacaoUtmProps) {
  const [destino, setDestino] = useState(SITE_URL ? `${SITE_URL.replace(/\/+$/, "")}/doar` : "");
  const [escolha, setEscolha] = useState<Record<UtmCategoria, string>>({ SOURCE: "", MEDIUM: "", CAMPAIGN: "" });

  const ativasPor = (categoria: UtmCategoria) => tags.filter((t) => t.categoria === categoria && t.ativo);

  const link = useMemo(() => {
    const base = destino.trim();
    if (!base) return "";
    const params = UTM_CATEGORIAS.filter((c) => escolha[c])
      .map((c) => `${INFO_CATEGORIA[c].parametro}=${encodeURIComponent(escolha[c])}`)
      .join("&");
    if (!params) return base;
    return `${base}${base.includes("?") ? "&" : "?"}${params}`;
  }, [destino, escolha]);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(link);
      successNotification("Link copiado.");
    } catch {
      errorNotification("Não foi possível copiar. Selecione o link e copie manualmente.");
    }
  }

  return (
    <section className="mb-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-start gap-3">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#368c5e]" aria-hidden />
        <div>
          <h2 className="text-lg font-bold text-[#1a5331]">Como funcionam as UTMs</h2>
          <p className="mt-1 text-sm text-gray-600">
            UTMs são etiquetas no final do link que dizem de onde veio cada doação ou compra da rifa. Elas aparecem no
            financeiro e permitem saber quais divulgações trazem resultado. As tags cadastradas aqui valem na hora para o
            site, para o backend de pagamentos e para os filtros do financeiro, sem precisar de deploy.
          </p>
        </div>
      </div>

      <div className="mb-5 grid gap-3 md:grid-cols-3">
        {UTM_CATEGORIAS.map((c) => (
          <div key={c} className="rounded-lg border border-gray-100 bg-[#f7f7f7] p-4">
            <p className="font-semibold text-[#1e1b1c]">{INFO_CATEGORIA[c].titulo}</p>
            <p className="text-xs text-gray-500">
              parâmetro <code className="rounded bg-white px-1">{INFO_CATEGORIA[c].parametro}</code>
            </p>
            <p className="mt-2 text-sm text-gray-700">{INFO_CATEGORIA[c].pergunta}</p>
            <p className="mt-1 text-xs text-gray-500">Ex.: {INFO_CATEGORIA[c].exemplo}</p>
          </div>
        ))}
      </div>

      <ul className="mb-6 list-disc space-y-1 pl-5 text-sm text-gray-700">
        <li>O código usa só letras maiúsculas sem acento, números e “_” (ex.: <code>NATAL_2026</code>). No link, maiúsculas e minúsculas são aceitas.</li>
        <li>Depois de criado, o código não muda: ele fica gravado no histórico do financeiro. Nome e descrição podem ser editados à vontade.</li>
        <li>Tag que já foi usada não pode ser excluída. Desative-a: o site para de aceitá-la, mas o histórico e os filtros continuam funcionando.</li>
        <li>Valores que não estão cadastrados (ou estão inativos) são ignorados pelo site. O pagamento acontece normalmente, só sem a origem.</li>
        <li>Tags marcadas como <strong>sistema</strong> (ex.: RIFA_SOLIDARIA) são usadas para separar a rifa das doações e não podem ser desativadas nem excluídas.</li>
      </ul>

      <div className="rounded-lg border border-dashed border-[#368c5e]/40 p-4">
        <p className="mb-3 font-semibold text-[#1a5331]">Gerador de link</p>
        <div className="grid gap-3 md:grid-cols-4">
          <label className="text-sm text-gray-700 md:col-span-4">
            Página de destino
            <input
              type="url"
              value={destino}
              onChange={(e) => setDestino(e.target.value)}
              placeholder="https://site-do-gatil.org/doar"
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#368c5e] focus:ring-1 focus:ring-[#368c5e]"
            />
          </label>
          {UTM_CATEGORIAS.map((c) => (
            <label key={c} className="text-sm text-gray-700">
              {INFO_CATEGORIA[c].titulo}
              <select
                value={escolha[c]}
                onChange={(e) => setEscolha((atual) => ({ ...atual, [c]: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#368c5e]"
              >
                <option value="">— nenhuma —</option>
                {ativasPor(c).map((t) => (
                  <option key={t.id} value={t.codigo}>
                    {t.nome} ({t.codigo})
                  </option>
                ))}
              </select>
            </label>
          ))}
          <div className="flex items-end">
            <button
              type="button"
              onClick={copiar}
              disabled={!link}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#368c5e] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1a5331] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Copy className="h-4 w-4" aria-hidden /> Copiar link
            </button>
          </div>
        </div>
        {link && (
          <p className="mt-3 break-all rounded bg-[#f7f7f7] px-3 py-2 font-mono text-xs text-gray-700" data-testid="link-utm">
            {link}
          </p>
        )}
      </div>
    </section>
  );
}
