import { useState } from "react";
import type { Rifa } from "../../types/rifa.type";

interface DetalhesNumeroModalProps {
  rifa: Rifa;
  baseUrl: string;
  onClose: () => void;
  onExcluido: (claimedNumber: number) => void;
}

export const DetalhesNumeroModal: React.FC<DetalhesNumeroModalProps> = ({
  rifa,
  baseUrl,
  onClose,
  onExcluido,
}) => {
  const [confirmando, setConfirmando] = useState(false);
  const [isExcluindo, setIsExcluindo] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleExcluir() {
    setIsExcluindo(true);
    setErro(null);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${baseUrl}/rifa/excluir-rifa/${rifa.claimedNumber}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        setErro(payload?.message ?? "Não foi possível excluir agora.");
        return;
      }

      onExcluido(rifa.claimedNumber);
      onClose();
    } catch {
      setErro("Erro de conexão. Tenta de novo.");
    } finally {
      setIsExcluindo(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[#9a9a92]">
              Número
            </p>
            <p className="text-4xl font-bold text-[#ff9d3b]">
              {String(rifa.claimedNumber).padStart(3, "0")}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-2xl leading-none text-[#9a9a92] hover:text-[#1e1b1c]"
            aria-label="Fechar"
          >
            ×
          </button>
        </div>

        <dl className="mb-6 space-y-3 text-sm">
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-[#9a9a92]">Nome</dt>
            <dd className="text-[#1e1b1c]">{rifa.name}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-[#9a9a92]">Telefone</dt>
            <dd className="text-[#1e1b1c]">{rifa.phone}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-[#9a9a92]">E-mail</dt>
            <dd className="text-[#1e1b1c]">{rifa.email}</dd>
          </div>
        </dl>

        {erro && (
          <p className="mb-3 text-xs text-red-600" role="alert">
            {erro}
          </p>
        )}

        {!confirmando ? (
          <button
            type="button"
            onClick={() => setConfirmando(true)}
            className="w-full rounded-lg border-2 border-red-300 bg-white px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50"
          >
            Excluir cadastro
          </button>
        ) : (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3.5">
            <p className="mb-3 text-xs leading-relaxed text-red-800">
              Isso remove o registro do banco, mas <strong>não cancela nem estorna</strong>{" "}
              nenhuma cobrança real — confirme que esse número não veio de um pagamento
              legítimo do Mercado Pago antes de excluir.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmando(false)}
                className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-600"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleExcluir}
                disabled={isExcluindo}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {isExcluindo ? "Excluindo..." : "Confirmar exclusão"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};