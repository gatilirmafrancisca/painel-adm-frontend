import { useState } from "react";
import { useForm } from "react-hook-form";
import { CODIGO_UTM_REGEX, INFO_CATEGORIA, UTM_CATEGORIAS, type UtmCategoria, type UtmTag, type UtmTagFormData } from "~/types/utm.type";
import { atualizarUtmTag, criarUtmTag } from "~/services/utm.api";

interface ModalUtmProps {
  /** Tag em edição; null para criar. */
  tag: UtmTag | null;
  categoriaInicial: UtmCategoria;
  onClose: () => void;
  onSalvo: (tag: UtmTag) => void;
}

const campo = "mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#368c5e] focus:ring-1 focus:ring-[#368c5e]";

export function ModalUtm({ tag, categoriaInicial, onClose, onSalvo }: ModalUtmProps) {
  const editando = Boolean(tag);
  const [erroServidor, setErroServidor] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UtmTagFormData>({
    defaultValues: {
      categoria: tag?.categoria ?? categoriaInicial,
      codigo: tag?.codigo ?? "",
      nome: tag?.nome ?? "",
      descricao: tag?.descricao ?? "",
      ativo: tag?.ativo ?? true,
    },
  });

  async function onSubmit(dados: UtmTagFormData) {
    setErroServidor(null);
    try {
      const salvo = tag
        ? await atualizarUtmTag(tag.id, {
            nome: dados.nome.trim(),
            descricao: dados.descricao.trim(),
            // tag de sistema não pode ser desativada: nem manda o campo
            ...(tag.sistema ? {} : { ativo: dados.ativo }),
          })
        : await criarUtmTag({ ...dados, codigo: dados.codigo.trim().toUpperCase(), nome: dados.nome.trim(), descricao: dados.descricao.trim() });
      onSalvo(salvo);
    } catch (erro) {
      setErroServidor(erro instanceof Error ? erro.message : "Não foi possível salvar a tag.");
    }
  }

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="titulo-modal-utm" className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 id="titulo-modal-utm" className="text-lg font-bold text-[#1a5331]">
            {editando ? `Editar ${tag!.codigo}` : "Nova tag de UTM"}
          </h2>
          <button type="button" onClick={onClose} className="text-2xl leading-none text-[#9a9a92] hover:text-[#1e1b1c]" aria-label="Fechar">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <label className="block text-sm text-gray-700">
            Categoria
            <select {...register("categoria")} disabled={editando} className={`${campo} bg-white disabled:bg-gray-50 disabled:text-gray-500`}>
              {UTM_CATEGORIAS.map((c) => (
                <option key={c} value={c}>
                  {INFO_CATEGORIA[c].titulo}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm text-gray-700">
            Código
            <input
              {...register("codigo", {
                setValueAs: (v: string) => String(v ?? "").trim().toUpperCase(),
                validate: (v) => editando || CODIGO_UTM_REGEX.test(v) || "Use de 2 a 40 caracteres: letras sem acento, números e “_”.",
              })}
              readOnly={editando}
              placeholder="TIKTOK"
              className={`${campo} font-mono uppercase read-only:bg-gray-50 read-only:text-gray-500`}
            />
            {editando ? (
              <span className="mt-1 block text-xs text-gray-500">O código não muda depois de criado (fica gravado no histórico do financeiro).</span>
            ) : (
              errors.codigo && <span className="mt-1 block text-xs text-red-600">{errors.codigo.message}</span>
            )}
          </label>

          <label className="block text-sm text-gray-700">
            Nome
            <input {...register("nome", { validate: (v) => v.trim().length > 0 || "Informe um nome.", maxLength: { value: 60, message: "Até 60 caracteres." } })} placeholder="TikTok" className={campo} />
            {errors.nome && <span className="mt-1 block text-xs text-red-600">{errors.nome.message}</span>}
          </label>

          <label className="block text-sm text-gray-700">
            Descrição <span className="text-gray-400">(opcional)</span>
            <textarea {...register("descricao", { maxLength: { value: 300, message: "Até 300 caracteres." } })} rows={3} placeholder="Quando usar esta tag" className={campo} />
            {errors.descricao && <span className="mt-1 block text-xs text-red-600">{errors.descricao.message}</span>}
          </label>

          <label className={`flex items-center gap-2 text-sm ${tag?.sistema ? "text-gray-400" : "text-gray-700"}`}>
            <input type="checkbox" {...register("ativo")} disabled={tag?.sistema} className="h-4 w-4 accent-[#368c5e]" />
            Ativa (aceita em novos pagamentos)
          </label>

          {erroServidor && <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">{erroServidor}</div>}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting} className="rounded-lg bg-[#368c5e] px-5 py-2 text-sm font-medium text-white hover:bg-[#1a5331] disabled:opacity-60">
              {isSubmitting ? "Salvando..." : editando ? "Salvar" : "Criar tag"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
