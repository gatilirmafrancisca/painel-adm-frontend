import type { Gato } from "~/types/gato.type";
import type { Rifa } from "~/types/rifa.type";
import { gatosMock, MOCK_TOKEN, MOCK_USER, pendentesEscolhaMock, reservasMock, rifasMock } from "./mockData";

// Modo mock: intercepta o fetch do navegador e responde às rotas do backend com dados
// fictícios em memória. Só é carregado quando VITE_MOCK_API=true (ver app/root.tsx).

const LATENCIA_MS = 400;

type MockRequest = {
  method: string;
  path: string;
  headers: Headers;
  body: BodyInit | null | undefined;
};

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function autorizado(req: MockRequest): boolean {
  return Boolean(req.headers.get("Authorization")?.startsWith("Bearer "));
}

function lerJson(body: BodyInit | null | undefined): any {
  if (typeof body !== "string") return null;
  try {
    return JSON.parse(body);
  } catch {
    return null;
  }
}

function criarGato(form: FormData, id: string): Gato {
  const texto = (campo: string) => String(form.get(campo) ?? "");
  const booleano = (campo: string) => texto(campo) === "true";
  const imagens = form
    .getAll("imagens")
    .filter((item): item is File => item instanceof File)
    .map((file) => URL.createObjectURL(file));

  return {
    id,
    nome: texto("nome"),
    idade: Number(texto("idade")),
    sexo: texto("sexo") as Gato["sexo"],
    cor: texto("cor") as Gato["cor"],
    castrado: booleano("castrado"),
    vacinado: booleano("vacinado"),
    vermifugado: booleano("vermifugado"),
    fivFelv: texto("fivFelv") as Gato["fivFelv"],
    personalidade: form.getAll("personalidade").map(String) as Gato["personalidade"],
    necessidadesEspeciais: booleano("necessidadesEspeciais"),
    descricaoBio: texto("descricaoBio"),
    status: texto("status") as Gato["status"],
    imagemUrl: imagens,
  };
}

export function installMockApi(baseUrl: string) {
  if (typeof window === "undefined" || (window as any).__mockApiInstalled) return;
  (window as any).__mockApiInstalled = true;

  // Banco em memória: reseta ao recarregar a página.
  let gatos: Gato[] = gatosMock();
  let rifas: Rifa[] = rifasMock();
  let pendentesEscolha = pendentesEscolhaMock();
  let reservas = reservasMock();
  let proximoId = gatos.length + 1;

  const base = baseUrl.replace(/\/+$/, "");
  const originalFetch = window.fetch.bind(window);

  // Retorna null para rotas que não são do backend; nesse caso a chamada segue para o fetch real.
  function responder(req: MockRequest): Response | null {
    const { method, path } = req;

    if (method === "POST" && path === "/auth/login") {
      const dados = lerJson(req.body);
      if (!dados?.login || !dados?.password) {
        return json(400, { message: "Informe usuário e senha." });
      }
      return json(200, {
        message: "Login realizado com sucesso (modo demo)",
        user: { token: MOCK_TOKEN, ...MOCK_USER },
      });
    }

    if (method === "GET" && path === "/protected") {
      return autorizado(req) ? json(200, { message: "ok", user: MOCK_USER }) : json(401, { message: "Não autorizado" });
    }

    if (method === "GET" && path === "/gatos") {
      return json(200, { data: gatos });
    }

    if (method === "POST" && path === "/gatos") {
      if (!autorizado(req)) return json(401, { message: "Não autorizado" });
      if (!(req.body instanceof FormData)) return json(400, { message: "Envie os dados como FormData." });
      const gato = criarGato(req.body, `mock-${proximoId++}`);
      gatos = [gato, ...gatos];
      return json(201, { message: "Gato cadastrado com sucesso", data: gato });
    }

    const gatoMatch = path.match(/^\/gatos\/([^/]+)$/);
    if (method === "DELETE" && gatoMatch) {
      if (!autorizado(req)) return json(401, { message: "Não autorizado" });
      const id = decodeURIComponent(gatoMatch[1]);
      if (!gatos.some((g) => g.id === id)) return json(404, { message: "Gato não encontrado" });
      gatos = gatos.filter((g) => g.id !== id);
      return json(200, { message: "Gato removido com sucesso" });
    }

    if (method === "GET" && path === "/rifa/listar-rifas") {
      if (!autorizado(req)) return json(401, { message: "Não autorizado" });
      return json(200, { data: rifas });
    }

    if (method === "GET" && path === "/rifa/resumo") {
      if (!autorizado(req)) return json(401, { message: "Não autorizado" });
      const reservadas = reservas;
      const compradas = rifas.filter((r) => r.status !== "CANCELADO").length;
      return json(200, {
        data: {
          total: 500,
          compradas,
          pendentesEscolha: pendentesEscolha.length,
          reservadas: reservadas.length,
          disponiveis: 500 - compradas - pendentesEscolha.length - reservadas.length,
          listas: { pendentesEscolha, reservadas },
        },
      });
    }

    const emailMatch = path.match(/^\/rifa\/pagamento\/([^/]+)\/email$/);
    if (method === "PATCH" && emailMatch) {
      if (!autorizado(req)) return json(401, { message: "Não autorizado" });
      const id = decodeURIComponent(emailMatch[1]);
      const email = String(lerJson(req.body)?.email ?? "").trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(400, { message: "O campo 'E-mail' não parece válido." });
      if (![...pendentesEscolha, ...reservas].some((p) => p.paymentId === id)) {
        return json(404, { message: "Pagamento não encontrado (ou cancelado)." });
      }
      pendentesEscolha = pendentesEscolha.map((p) => (p.paymentId === id ? { ...p, email } : p));
      reservas = reservas.map((p) => (p.paymentId === id ? { ...p, email } : p));
      return json(200, { message: "E-mail atualizado.", data: { paymentId: id, email } });
    }

    if (method === "POST" && path === "/rifa/criar-rifa") {
      if (!autorizado(req)) return json(401, { message: "Não autorizado" });
      const dados = lerJson(req.body);
      const numero = Number(dados?.claimedNumber);
      if (!Number.isInteger(numero) || numero < 1 || numero > 500) {
        return json(400, { message: "Número inválido." });
      }
      if (rifas.some((r) => r.claimedNumber === numero)) {
        return json(409, { message: `O número ${numero} já está reservado.` });
      }
      const rifa: Rifa = {
        claimedNumber: numero,
        name: String(dados?.name ?? ""),
        phone: String(dados?.phone ?? ""),
        email: String(dados?.email ?? ""),
        status: "PENDENTE",
      };
      rifas = [...rifas, rifa].sort((a, b) => a.claimedNumber - b.claimedNumber);
      return json(201, { message: "Número cadastrado com sucesso", data: rifa });
    }

    const rifaMatch = path.match(/^\/rifa\/excluir-rifa\/(\d+)$/);
    if (method === "DELETE" && rifaMatch) {
      if (!autorizado(req)) return json(401, { message: "Não autorizado" });
      const numero = Number(rifaMatch[1]);
      if (!rifas.some((r) => r.claimedNumber === numero)) return json(404, { message: "Número não encontrado" });
      rifas = rifas.filter((r) => r.claimedNumber !== numero);
      return json(200, { message: "Número excluído com sucesso" });
    }

    return null;
  }

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = input instanceof Request ? input.url : String(input);
    if (url !== base && !url.startsWith(`${base}/`)) return originalFetch(input, init);

    const path = url.slice(base.length).split(/[?#]/)[0] || "/";
    const req: MockRequest = {
      method: (init?.method ?? (input instanceof Request ? input.method : "GET")).toUpperCase(),
      path,
      headers: new Headers(init?.headers ?? (input instanceof Request ? input.headers : undefined)),
      body: init?.body,
    };

    const resposta = responder(req);
    if (!resposta) return originalFetch(input, init);

    await new Promise((resolve) => setTimeout(resolve, LATENCIA_MS));
    return resposta;
  };

  console.info(`[mock-api] Modo demo ativo: chamadas para ${base} estão sendo respondidas com dados fictícios.`);
}
