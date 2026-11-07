import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import type { Pedido } from "../../types/rifa.type";
import { ROTULO_ALERTA } from "./ComprasRifa";

const pad = (n: number) => String(n).padStart(3, "0");
const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/**
 * Compras que precisam de alguém olhar: pagamento em dobro (estornar no
 * Mercado Pago), valor diferente do pedido, pago depois da reserva vencer e
 * números que a pessoa ainda vai escolher. Some quando não há nada.
 */
export function AlertasRifa({ baseUrl }: { baseUrl: string }) {
  const [alertas, setAlertas] = useState<Pedido[]>([]);

  useEffect(() => {
    let ativo = true;
    fetch(`${baseUrl}/rifa/alertas`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token") ?? ""}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((payload) => { if (ativo && Array.isArray(payload?.data)) setAlertas(payload.data); })
      .catch(() => undefined);
    return () => { ativo = false; };
  }, [baseUrl]);

  if (!alertas.length) return null;

  return (
    <section className="mb-6 rounded-xl border border-[#f5c9a1] bg-[#fff7ef] p-4" aria-label="Compras que precisam de atenção">
      <h2 className="mb-2 flex items-center gap-2 text-sm font-bold text-[#a4520b]">
        <AlertTriangle size={16} /> {alertas.length} {alertas.length === 1 ? "compra precisa" : "compras precisam"} de atenção
      </h2>
      <ul className="space-y-1.5 text-sm text-[#5a3a1a]">
        {alertas.map((p) => (
          <li key={p.pedidoId}>
            <b>{[p.nome, p.email].filter(Boolean).join(" · ") || `Compra ${p.pedidoId.slice(0, 8)}`}</b>
            {" — "}
            {[
              ...p.alertas.map((a) => ROTULO_ALERTA[a] ?? a),
              ...(p.numerosAEscolher > 0 ? [`${p.numerosAEscolher} número(s) a escolher`] : []),
            ].join("; ")}
            {p.pagamentosExtras.length > 0 && (
              <> (estornar: {p.pagamentosExtras.map((e) => `ID ${e.mpPaymentId}, ${brl(e.valor)}`).join("; ")})</>
            )}
            {p.numerosConfirmados.length > 0 && <span className="text-xs"> · números {p.numerosConfirmados.map(pad).join(", ")}</span>}
          </li>
        ))}
      </ul>
    </section>
  );
}
