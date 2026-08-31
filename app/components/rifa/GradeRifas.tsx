import type { Rifa } from "../../types/rifa.type";

interface GradeRifasProps {
  rifasPorNumero: Map<number, Rifa>;
  onSelecionarOcupado: (rifa: Rifa) => void;
  onSelecionarDisponivel: (numero: number) => void;
}

const TOTAL_NUMEROS = 500;
const BLOCK_SIZE = 50;

function padNumero(n: number): string {
  return String(n).padStart(3, "0");
}

function construirBlocos(): number[][] {
  const blocos: number[][] = [];
  for (let inicio = 1; inicio <= TOTAL_NUMEROS; inicio += BLOCK_SIZE) {
    const fim = Math.min(inicio + BLOCK_SIZE - 1, TOTAL_NUMEROS);
    blocos.push(Array.from({ length: fim - inicio + 1 }, (_, i) => inicio + i));
  }
  return blocos;
}

const blocos = construirBlocos();

export const GradeRifas: React.FC<GradeRifasProps> = ({
  rifasPorNumero,
  onSelecionarOcupado,
  onSelecionarDisponivel,
}) => {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-3.5 flex flex-wrap gap-4 text-xs text-[#5a5a54]">
        <span className="flex items-center gap-1.5">
          <i className="inline-block h-3 w-3 rounded border-2 border-[#368c5e] bg-white" />
          Disponível — clique pra cadastrar
        </span>
        <span className="flex items-center gap-1.5">
          <i className="inline-block h-3 w-3 rounded bg-[#368c5e]" />
          Ocupado — clique pra ver detalhes
        </span>
      </div>

      <div className="max-h-[600px] overflow-y-auto rounded-xl border border-[#e3e3dd] bg-[#fafaf8] p-3.5">
        {blocos.map((bloco) => (
          <div key={bloco[0]} className="mb-3.5 last:mb-0">
            <p className="mb-1.5 text-[11px] font-extrabold uppercase tracking-wide text-[#9a9a92]">
              {padNumero(bloco[0])} — {padNumero(bloco[bloco.length - 1])}
            </p>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(44px,1fr))] gap-1.5">
              {bloco.map((numero) => {
                const rifa = rifasPorNumero.get(numero);
                const ocupado = Boolean(rifa);

                return (
                  <button
                    key={numero}
                    type="button"
                    onClick={() =>
                      ocupado ? onSelecionarOcupado(rifa!) : onSelecionarDisponivel(numero)
                    }
                    aria-label={`Número ${numero}, ${ocupado ? "ocupado" : "disponível"}`}
                    className={`aspect-square min-h-[44px] rounded-lg border-2 text-xs font-bold transition ${
                      ocupado
                        ? "border-[#368c5e] bg-[#368c5e] text-white hover:bg-[#1a5331]"
                        : "border-[#368c5e] bg-white text-[#1a5331] hover:-translate-y-0.5 hover:bg-[#368c5e]/10"
                    }`}
                  >
                    {padNumero(numero)}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};