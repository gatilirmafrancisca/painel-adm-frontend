import { FormularioCadastroRifa } from "./FormularioCadastroRifa";
import type { Rifa } from "../../types/rifa.type";

interface ModalCadastroRifaProps {
  baseUrl: string;
  numeroInicial: number | null;
  onClose: () => void;
  onCriado: (rifa: Rifa) => void;
}

export const ModalCadastroRifa: React.FC<ModalCadastroRifaProps> = ({
  baseUrl,
  numeroInicial,
  onClose,
  onCriado,
}) => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#1a5331]">Cadastrar venda manual</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-2xl leading-none text-[#9a9a92] hover:text-[#1e1b1c]"
            aria-label="Fechar"
          >
            ×
          </button>
        </div>

        <FormularioCadastroRifa
          baseUrl={baseUrl}
          numeroInicial={numeroInicial}
          onCriado={(rifa) => {
            onCriado(rifa);
            onClose();
          }}
        />
      </div>
    </div>
  );
};