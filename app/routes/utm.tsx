import { useCallback, useEffect, useMemo, useState } from "react";
import { ExplicacaoUtm } from "~/components/utm/ExplicacaoUtm";
import { TabelaUtm } from "~/components/utm/TabelaUtm";
import { ModalUtm } from "~/components/utm/ModalUtm";
import { errorNotification, successNotification } from "~/components/ToasterComponents/ToasterNotifications";
import { atualizarUtmTag, excluirUtmTag, listarUtmTags, UtmApiError } from "~/services/utm.api";
import { INFO_CATEGORIA, UTM_CATEGORIAS, type UtmCategoria, type UtmTag } from "~/types/utm.type";

type ModalEstado = { tag: UtmTag | null } | null;

const Utm: React.FC = () => {
  const [tags, setTags] = useState<UtmTag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [aba, setAba] = useState<UtmCategoria>("SOURCE");
  const [modal, setModal] = useState<ModalEstado>(null);
  const [paraExcluir, setParaExcluir] = useState<UtmTag | null>(null);
  /** 409 na exclusão: a tag já foi usada; oferece desativar. */
  const [emUso, setEmUso] = useState<{ tag: UtmTag; mensagem: string } | null>(null);

  const carregar = useCallback(async () => {
    setIsLoading(true);
    setErro(null);
    try {
      setTags(await listarUtmTags());
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível carregar as tags.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const tagsDaAba = useMemo(() => tags.filter((t) => t.categoria === aba), [tags, aba]);

  const substituir = (salva: UtmTag) =>
    setTags((atual) => {
      const existe = atual.some((t) => t.id === salva.id);
      const lista = existe ? atual.map((t) => (t.id === salva.id ? salva : t)) : [...atual, salva];
      return lista.sort((a, b) => a.codigo.localeCompare(b.codigo));
    });

  async function alternarAtivo(tag: UtmTag) {
    try {
      const salva = await atualizarUtmTag(tag.id, { ativo: !tag.ativo });
      substituir(salva);
      successNotification(`Tag ${salva.codigo} ${salva.ativo ? "ativada" : "desativada"}.`);
    } catch (e) {
      errorNotification(e instanceof Error ? e.message : "Não foi possível alterar a tag.");
    }
  }

  async function confirmarExclusao() {
    if (!paraExcluir) return;
    const tag = paraExcluir;
    setParaExcluir(null);
    try {
      await excluirUtmTag(tag.id);
      setTags((atual) => atual.filter((t) => t.id !== tag.id));
      successNotification(`Tag ${tag.codigo} excluída.`);
    } catch (e) {
      if (e instanceof UtmApiError && e.status === 409 && !tag.sistema && tag.ativo) {
        setEmUso({ tag, mensagem: e.message });
        return;
      }
      errorNotification(e instanceof Error ? e.message : "Não foi possível excluir a tag.");
    }
  }

  return (
    <div className="relative mx-auto flex h-full max-w-7xl flex-col p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-[#1e1b1c]">UTM</h1>
        <button
          onClick={() => setModal({ tag: null })}
          className="rounded-lg bg-[#368c5e] px-5 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-[#1a5331]"
        >
          + Nova tag
        </button>
      </div>

      {erro && <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</div>}

      <ExplicacaoUtm tags={tags} />

      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div role="tablist" aria-label="Categorias de UTM" className="flex overflow-x-auto border-b border-gray-100">
          {UTM_CATEGORIAS.map((c) => {
            const total = tags.filter((t) => t.categoria === c).length;
            return (
              <button
                key={c}
                role="tab"
                aria-selected={aba === c}
                onClick={() => setAba(c)}
                className={`whitespace-nowrap px-5 py-3 text-sm font-medium transition-colors ${
                  aba === c ? "border-b-2 border-[#1a5331] text-[#1a5331]" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {INFO_CATEGORIA[c].titulo} <span className="text-xs text-gray-400">({total})</span>
              </button>
            );
          })}
        </div>
        <TabelaUtm
          tags={tagsDaAba}
          isLoading={isLoading}
          onEditar={(tag) => setModal({ tag })}
          onAlternarAtivo={alternarAtivo}
          onExcluir={setParaExcluir}
        />
      </div>

      {modal && (
        <ModalUtm
          tag={modal.tag}
          categoriaInicial={aba}
          onClose={() => setModal(null)}
          onSalvo={(salva) => {
            substituir(salva);
            setAba(salva.categoria);
            setModal(null);
            successNotification(modal.tag ? `Tag ${salva.codigo} atualizada.` : `Tag ${salva.codigo} criada.`);
          }}
        />
      )}

      {paraExcluir && (
        <Confirmacao
          titulo={`Excluir ${paraExcluir.codigo}?`}
          texto="A tag some da lista e o site deixa de aceitá-la. Só é possível excluir tags que nunca foram usadas."
          confirmar="Excluir"
          perigo
          onConfirmar={confirmarExclusao}
          onCancelar={() => setParaExcluir(null)}
        />
      )}

      {emUso && (
        <Confirmacao
          titulo="Esta tag já foi usada"
          texto={`${emUso.mensagem} Desativada, ela continua no histórico e nos filtros do financeiro.`}
          confirmar="Desativar"
          onConfirmar={async () => {
            const { tag } = emUso;
            setEmUso(null);
            await alternarAtivo(tag);
          }}
          onCancelar={() => setEmUso(null)}
        />
      )}
    </div>
  );
};

function Confirmacao(props: {
  titulo: string;
  texto: string;
  confirmar: string;
  perigo?: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
}) {
  return (
    <div role="alertdialog" aria-modal="true" aria-label={props.titulo} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={props.onCancelar}>
      <div className="w-full max-w-sm rounded-2xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-2 text-lg font-bold text-[#1e1b1c]">{props.titulo}</h2>
        <p className="mb-5 text-sm text-gray-600">{props.texto}</p>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={props.onCancelar} className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
            Cancelar
          </button>
          <button
            type="button"
            onClick={props.onConfirmar}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${props.perigo ? "bg-red-600 hover:bg-red-700" : "bg-[#368c5e] hover:bg-[#1a5331]"}`}
          >
            {props.confirmar}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Utm;
