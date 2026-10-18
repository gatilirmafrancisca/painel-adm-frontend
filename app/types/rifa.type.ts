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

/** Quem pagou e ainda não escolheu o número (GET /rifa/resumo). */
type PendenteEscolha = {
  paymentId: string,
  email: string | null,
  pagoEm: string, // ISO
  diasRestantes: number, // até o número ser sorteado
}

/** Pix gerado e ainda não pago: ocupa a vaga até vencer. */
type Reserva = {
  paymentId: string,
  email: string | null,
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

export type { Rifa, CriarRifaFormData, PendenteEscolha, Reserva, ResumoRifas };