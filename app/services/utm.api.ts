import type { UtmCategoria, UtmTag, UtmTagFormData } from "~/types/utm.type";

const BASEURL =
  import.meta.env.VITE_BASE_URL ??
  (typeof window !== "undefined" ? window.location.origin : "http://localhost");

/** Erro com a mensagem que o backend devolveu (ex.: 409 de tag em uso). */
export class UtmApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = "UtmApiError";
  }
}

async function chamar<T>(caminho: string, init: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("token");
  let response: Response;
  try {
    response = await fetch(`${BASEURL}${caminho}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init.headers,
      },
    });
  } catch {
    throw new UtmApiError("Erro de conexão com o servidor.", 0);
  }

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const padrao = response.status === 403 ? "Apenas administradores podem alterar as tags." : "Não foi possível concluir a operação.";
    throw new UtmApiError(payload?.message ?? padrao, response.status);
  }
  return payload?.data as T;
}

export const listarUtmTags = (categoria?: UtmCategoria) =>
  chamar<UtmTag[]>(`/utm${categoria ? `?categoria=${categoria}` : ""}`);

export const criarUtmTag = (dados: UtmTagFormData) =>
  chamar<UtmTag>("/utm", { method: "POST", body: JSON.stringify(dados) });

export const atualizarUtmTag = (id: string, dados: Partial<Pick<UtmTag, "nome" | "descricao" | "ativo">>) =>
  chamar<UtmTag>(`/utm/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(dados) });

export const excluirUtmTag = (id: string) =>
  chamar<{ id: string }>(`/utm/${encodeURIComponent(id)}`, { method: "DELETE" });
