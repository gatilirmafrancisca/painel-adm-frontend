export const UTM_CATEGORIAS = ["SOURCE", "MEDIUM", "CAMPAIGN"] as const;
export type UtmCategoria = (typeof UTM_CATEGORIAS)[number];

export interface UtmTag {
  id: string;
  categoria: UtmCategoria;
  codigo: string;
  nome: string;
  descricao: string;
  ativo: boolean;
  /** Usada pela lógica do sistema (ex.: RIFA_SOLIDARIA): não pode ser desativada nem excluída. */
  sistema: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UtmTagFormData {
  categoria: UtmCategoria;
  codigo: string;
  nome: string;
  descricao: string;
  ativo: boolean;
}

/** Igual à regra do backend: maiúsculas sem acento, números e "_". */
export const CODIGO_UTM_REGEX = /^[A-Z0-9_]{2,40}$/;

export const INFO_CATEGORIA: Record<UtmCategoria, { titulo: string; parametro: string; pergunta: string; exemplo: string }> = {
  SOURCE: {
    titulo: "Source (origem)",
    parametro: "utm_source",
    pergunta: "De onde a pessoa veio?",
    exemplo: "INSTAGRAM, FACEBOOK, FEIRA_ADOCAO",
  },
  MEDIUM: {
    titulo: "Medium (meio)",
    parametro: "utm_medium",
    pergunta: "Que tipo de divulgação trouxe a pessoa?",
    exemplo: "ORGANICO, PAGO",
  },
  CAMPAIGN: {
    titulo: "Campaign (campanha)",
    parametro: "utm_campaign",
    pergunta: "Qual campanha ou ação ela estava vendo?",
    exemplo: "CAMPANHA_ESPECIFICA, RIFA_SOLIDARIA",
  },
};
