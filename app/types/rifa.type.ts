type Rifa = {

    claimedNumber : number,
    name : string,
    phone : string,
    email : string,
    status: "PENDENTE" | "APROVADO" | "CANCELADO",
}

type CriarRifaFormData = {
  name: string,
  phone: string,
  claimedNumber: string, // string no formulário, convertido pra number só no submit
  email: string,
}

/** Contato de um pagamento sem número (GET /rifa/resumo). */
type ContatoPagamento = {
  paymentId: string,
  email: string | null,
  nomePagador: string | null, // pagador ou titular do cartão (no Pix o MP não informa)
  bancoPagador: string | null, // banco de origem do Pix — não é a pessoa
  metodoPagamento: string | null, // "pix", "cartao" ou o tipo do Mercado Pago
  linkEscolha: string | null, // link para escolher o número
}

/** Quem pagou e ainda não escolheu o número. */
type PendenteEscolha = ContatoPagamento & {
  pagoEm: string, // ISO
  diasRestantes: number, // até o número ser sorteado
}

/** Pagamento iniciado e ainda não aprovado: ocupa a vaga até vencer. */
type Reserva = ContatoPagamento & {
  criadoEm: string, // ISO
}

type ResumoRifas = {
  total: number,
  compradas: number,
  pendentesEscolha: number,
  reservadas: number,
  disponiveis: number,
  listas: {
    pendentesEscolha: PendenteEscolha[],
    reservadas: Reserva[],
  },
}

export type { Rifa, CriarRifaFormData, ContatoPagamento, PendenteEscolha, Reserva, ResumoRifas };