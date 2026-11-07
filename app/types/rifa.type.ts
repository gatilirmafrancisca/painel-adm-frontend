type Rifa = {

    claimedNumber : number,
    name : string,
    phone : string,
    email : string,
    status: "PENDENTE" | "APROVADO" | "CANCELADO" | "RESERVADO",
    // Compra do site (Ação de Natal): o pedido e como foi pago.
    pedidoId?: string | null,
    metodoPagamento?: string | null,
    dataPagamento?: string | null,
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
  // Compra do site com reserva: os números guardados e até quando.
  pedidoId?: string,
  numeros?: number[],
  expiraEm?: string,
  nome?: string | null,
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

type StatusPedido = "RESERVADO" | "AGUARDANDO_PAGAMENTO" | "PAGO" | "PAGO_PARCIAL" | "EXPIRADO" | "CANCELADO";
type AlertaPedido = "VALOR_DIVERGENTE" | "PAGAMENTO_DUPLICADO" | "PAGO_APOS_EXPIRAR";

/** Compra da Ação de Natal (GET /rifa/pedidos). */
type Pedido = {
  pedidoId: string,
  status: StatusPedido,
  numeros: number[],
  numerosConfirmados: number[],
  numerosAEscolher: number,
  valor: number,
  metodo: "pix" | "cartao" | null,
  mpPaymentId: string | null,
  nome: string | null,
  email: string | null,
  phone: string | null,
  criadoEm: string,
  expiraEm: string,
  pagoEm: string | null,
  alertas: AlertaPedido[],
  pagamentosExtras: { mpPaymentId: string, valor: number, em: string }[],
  utmSource: string | null,
}

export type { Pedido, StatusPedido, AlertaPedido };
export type { Rifa, CriarRifaFormData, ContatoPagamento, PendenteEscolha, Reserva, ResumoRifas };