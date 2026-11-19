import { Lock, Pencil, Power, Trash2 } from "lucide-react";
import type { UtmTag } from "~/types/utm.type";

interface TabelaUtmProps {
  tags: UtmTag[];
  isLoading: boolean;
  onEditar: (tag: UtmTag) => void;
  onAlternarAtivo: (tag: UtmTag) => void;
  onExcluir: (tag: UtmTag) => void;
}

const botao = "rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-[#1a5331] disabled:cursor-not-allowed disabled:opacity-30";

export function TabelaUtm({ tags, isLoading, onEditar, onAlternarAtivo, onExcluir }: TabelaUtmProps) {
  if (isLoading) {
    return <p className="p-6 text-sm text-gray-500">Carregando tags...</p>;
  }
  if (tags.length === 0) {
    return <p className="p-6 text-sm text-gray-500">Nenhuma tag nesta categoria ainda.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-gray-100 bg-[#f7f7f7] text-xs uppercase text-gray-500">
          <tr>
            <th className="px-4 py-3">Código</th>
            <th className="px-4 py-3">Nome</th>
            <th className="px-4 py-3">Descrição</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {tags.map((tag) => (
            <tr key={tag.id} className="border-b border-gray-50 last:border-0">
              <td className="px-4 py-3 font-mono font-semibold text-[#1e1b1c]">
                <span className="inline-flex items-center gap-2">
                  {tag.codigo}
                  {tag.sistema && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 font-sans text-[11px] font-medium text-amber-700" title="Usada pela lógica do sistema">
                      <Lock className="h-3 w-3" aria-hidden /> sistema
                    </span>
                  )}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-700">{tag.nome}</td>
              <td className="max-w-xs px-4 py-3 text-gray-500">{tag.descricao || "—"}</td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    tag.ativo ? "bg-green-50 text-[#1a5331]" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {tag.ativo ? "Ativa" : "Inativa"}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-1">
                  <button type="button" className={botao} onClick={() => onEditar(tag)} aria-label={`Editar ${tag.codigo}`} title="Editar">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className={botao}
                    onClick={() => onAlternarAtivo(tag)}
                    disabled={tag.sistema}
                    aria-label={`${tag.ativo ? "Desativar" : "Ativar"} ${tag.codigo}`}
                    title={tag.sistema ? "Tag de sistema" : tag.ativo ? "Desativar" : "Ativar"}
                  >
                    <Power className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className={`${botao} hover:text-red-600`}
                    onClick={() => onExcluir(tag)}
                    disabled={tag.sistema}
                    aria-label={`Excluir ${tag.codigo}`}
                    title={tag.sistema ? "Tag de sistema" : "Excluir"}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
