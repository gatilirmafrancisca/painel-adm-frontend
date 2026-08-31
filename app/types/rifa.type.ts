type Rifa = {

    claimedNumber : number,
    name : string,
    phone : string,
    email : string,
}

type CriarRifaFormData = {
  name: string,
  phone: string,
  claimedNumber: string, // string no formulário, convertido pra number só no submit
  email: string,
}

export type { Rifa, CriarRifaFormData };