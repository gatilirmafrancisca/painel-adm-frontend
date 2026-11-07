import type { Gato } from "~/types/gato.type";
import type { Pedido, PendenteEscolha, Reserva, Rifa } from "~/types/rifa.type";

// Dados fictícios usados apenas quando VITE_MOCK_API=true (ver app/mocks/mockApi.ts).

export const MOCK_TOKEN = "mock-token";

export const MOCK_USER = {
  name: "Usuária Demo",
  email: "demo@gatil.org",
};

// Gera uma ilustração simples de gato em SVG (data URI), para funcionar sem internet.
function imagemGato(fundo: string, pelo: string, detalhe = pelo): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
<rect width="400" height="300" fill="${fundo}"/>
<polygon points="130,110 150,40 190,95" fill="${pelo}"/>
<polygon points="270,110 250,40 210,95" fill="${pelo}"/>
<ellipse cx="200" cy="150" rx="90" ry="75" fill="${pelo}"/>
<ellipse cx="200" cy="175" rx="40" ry="28" fill="${detalhe}"/>
<circle cx="165" cy="140" r="12" fill="#1e1b1c"/>
<circle cx="235" cy="140" r="12" fill="#1e1b1c"/>
<circle cx="169" cy="136" r="4" fill="#fff"/>
<circle cx="239" cy="136" r="4" fill="#fff"/>
<polygon points="192,165 208,165 200,175" fill="#e8838f"/>
<ellipse cx="200" cy="290" rx="120" ry="60" fill="${pelo}"/>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

// Funções (e não constantes) para que nada disso seja montado nem entre no bundle quando o mock está desligado.
export const gatosMock = (): Gato[] => [
  {
    id: "mock-1",
    nome: "Mingau",
    idade: 24,
    sexo: "Macho",
    cor: "Branco Sólido",
    castrado: true,
    vacinado: true,
    vermifugado: true,
    fivFelv: "Negativo",
    personalidade: ["Afetuoso", "Gato de Colo", "Calmo"],
    necessidadesEspeciais: false,
    descricaoBio:
      "Mingau foi resgatado de um estacionamento e hoje é o rei do sofá. Adora colo, ronrona alto e se dá bem com outros gatos.",
    status: "Disponível",
    imagemUrl: [
      imagemGato("#d9f0e3", "#ffffff", "#f1f1f1"),
      imagemGato("#ffe8cf", "#ffffff", "#f1f1f1"),
      imagemGato("#e3e7ff", "#ffffff", "#f1f1f1"),
    ],
  },
  {
    id: "mock-2",
    nome: "Pantera",
    idade: 36,
    sexo: "Fêmea",
    cor: "Preto Sólido",
    castrado: true,
    vacinado: true,
    vermifugado: true,
    fivFelv: "Negativo",
    personalidade: ["Independente", "Silencioso", "Explorador"],
    necessidadesEspeciais: false,
    descricaoBio: "Elegante e observadora. Precisa de um tempinho para confiar, mas depois não larga mais.",
    status: "Reservado",
    imagemUrl: [imagemGato("#ffe8cf", "#2b2b2b", "#3d3d3d")],
  },
  {
    id: "mock-3",
    nome: "Laranjinha",
    idade: 6,
    sexo: "Macho",
    cor: "Laranja",
    castrado: false,
    vacinado: true,
    vermifugado: true,
    fivFelv: "Negativo",
    personalidade: ["Brincalhão", "Ativo", "Destemido", "Vocal"],
    necessidadesEspeciais: false,
    descricaoBio: "Filhote cheio de energia. Corre atrás de qualquer coisa que se mexa.",
    status: "Disponível",
    imagemUrl: [imagemGato("#e3f2fd", "#ff9d3b", "#ffc285"), imagemGato("#fff4d6", "#ff9d3b", "#ffc285")],
  },
  {
    id: "mock-4",
    nome: "Frida",
    idade: 48,
    sexo: "Fêmea",
    cor: "Tricolor",
    castrado: true,
    vacinado: true,
    vermifugado: false,
    fivFelv: "FIV+",
    personalidade: ["Gato Único", "Afetuoso"],
    necessidadesEspeciais: true,
    descricaoBio:
      "Frida é FIV+ e precisa ser a única gata da casa. Faz acompanhamento veterinário a cada 6 meses e é extremamente carinhosa com humanos.\n\nIdeal para um lar tranquilo, sem outros animais.",
    status: "Em Tratamento",
    imagemUrl: [imagemGato("#f3e5f5", "#c97b3c", "#f5f5f5")],
  },
  {
    id: "mock-5",
    nome: "Tigrão",
    idade: 60,
    sexo: "Macho",
    cor: "Tigrado",
    castrado: true,
    vacinado: true,
    vermifugado: true,
    fivFelv: "Negativo",
    personalidade: ["Sociável", "Amigo de Cães", "Paciente com Crianças"],
    necessidadesEspeciais: false,
    descricaoBio: "Convive bem com cachorros e crianças. Um gato de família.",
    status: "Adotado",
    imagemUrl: [imagemGato("#d9f0e3", "#8d6e4f", "#b39575")],
  },
  {
    id: "mock-6",
    nome: "Nuvem",
    idade: 18,
    sexo: "Fêmea",
    cor: "Cinza Sólido",
    castrado: true,
    vacinado: false,
    vermifugado: true,
    fivFelv: "Negativo",
    personalidade: ["Tímido", "Calmo"],
    necessidadesEspeciais: false,
    descricaoBio: "Tímida no começo, mas adora um cantinho perto da janela.",
    status: "Disponível",
    imagemUrl: [imagemGato("#fff4d6", "#9e9e9e", "#bdbdbd")],
  },
  {
    id: "mock-7",
    nome: "Sushi",
    idade: 30,
    sexo: "Macho",
    cor: "Sialata",
    castrado: true,
    vacinado: true,
    vermifugado: true,
    fivFelv: "FeLV+",
    personalidade: ["Vocal", "Afetuoso", "Gato de Colo"],
    necessidadesEspeciais: true,
    descricaoBio: "Conversa o dia todo. É FeLV+ e precisa de cuidados especiais com a imunidade.",
    status: "Em Tratamento",
    imagemUrl: [imagemGato("#e3e7ff", "#efe3cf", "#5d4037")],
  },
  {
    id: "mock-8",
    nome: "Paçoca",
    idade: 10,
    sexo: "Fêmea",
    cor: "Escaminha",
    castrado: false,
    vacinado: true,
    vermifugado: true,
    fivFelv: "Negativo",
    personalidade: ["Brincalhão", "Amigo de Gatos"],
    necessidadesEspeciais: false,
    descricaoBio: "Ama brincar com os irmãos de gatil.",
    status: "Disponível",
    imagemUrl: [imagemGato("#d9f0e3", "#5d4037", "#c97b3c")],
  },
  {
    id: "mock-9",
    nome: "Bigode",
    idade: 72,
    sexo: "Macho",
    cor: "Frajola",
    castrado: true,
    vacinado: true,
    vermifugado: true,
    fivFelv: "FIV+ FeLV+",
    personalidade: ["Calmo", "Silencioso", "Gato Único"],
    necessidadesEspeciais: true,
    descricaoBio: "Senhorzinho tranquilo que procura um lar para aproveitar a melhor idade.",
    status: "Disponível",
    imagemUrl: [imagemGato("#ffe8cf", "#2b2b2b", "#ffffff")],
  },
  {
    id: "mock-10",
    nome: "Canela",
    idade: 14,
    sexo: "Fêmea",
    cor: "Branco com Laranja",
    castrado: true,
    vacinado: true,
    vermifugado: true,
    fivFelv: "Negativo",
    personalidade: ["Sociável", "Explorador"],
    necessidadesEspeciais: false,
    descricaoBio: "Curiosa, investiga cada caixa nova que aparece.",
    status: "Reservado",
    imagemUrl: [imagemGato("#e3f2fd", "#ffffff", "#ff9d3b")],
  },
  {
    id: "mock-11",
    nome: "Pipoca",
    idade: 4,
    sexo: "Macho",
    cor: "Branco com Tigrado",
    castrado: false,
    vacinado: false,
    vermifugado: true,
    fivFelv: "Negativo",
    personalidade: ["Brincalhão", "Ativo"],
    necessidadesEspeciais: false,
    descricaoBio: "Filhote resgatado com a ninhada. Ainda aguardando as vacinas.",
    status: "Em Tratamento",
    imagemUrl: [imagemGato("#f3e5f5", "#ffffff", "#8d6e4f")],
  },
  {
    id: "mock-12",
    nome: "Amora",
    idade: 42,
    sexo: "Fêmea",
    cor: "Preto Sólido",
    castrado: true,
    vacinado: true,
    vermifugado: true,
    fivFelv: "Negativo",
    personalidade: ["Gato de Colo", "Paciente com Crianças", "Amigo de Cães", "Afetuoso"],
    necessidadesEspeciais: false,
    descricaoBio: "Adotada em 2025, vive com uma família de quatro pessoas e um labrador.",
    status: "Adotado",
    imagemUrl: [imagemGato("#fff4d6", "#2b2b2b", "#3d3d3d")],
  },
];

const NOMES = [
  "Ana Souza", "Bruno Lima", "Carla Mendes", "Diego Santos", "Eduarda Rocha",
  "Felipe Araújo", "Gabriela Costa", "Henrique Alves", "Isabela Martins", "João Pereira",
  "Karina Ribeiro", "Lucas Oliveira", "Mariana Freitas", "Nicolas Barbosa", "Olívia Cardoso",
];

const NUMEROS_OCUPADOS = [
  1, 7, 13, 21, 33, 42, 50, 55, 68, 77, 88, 99, 100, 111, 123, 150, 171, 189, 200, 222,
  234, 250, 256, 271, 300, 314, 333, 350, 365, 377, 400, 404, 420, 444, 450, 471, 488, 499, 500,
];

const STATUS: Rifa["status"][] = ["APROVADO", "APROVADO", "PENDENTE", "APROVADO", "CANCELADO"];

export const rifasMock = (): Rifa[] => NUMEROS_OCUPADOS.map((claimedNumber, i) => {
  const name = NOMES[i % NOMES.length];
  const usuario = name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(" ", ".");
  return {
    claimedNumber,
    name,
    phone: `(71) 9 ${String(8000 + i * 37).slice(0, 4)}-${String(1000 + i * 113).slice(-4)}`,
    // Alguns sem e-mail, como acontece no cadastro manual (campo opcional).
    email: i % 4 === 3 ? "" : `${usuario}@exemplo.com`,
    status: STATUS[i % STATUS.length],
  };
});

const diasAtras = (dias: number) => new Date(Date.now() - dias * 24 * 60 * 60_000).toISOString();
const minutosAtras = (min: number) => new Date(Date.now() - min * 60_000).toISOString();

// Pagaram e ainda não escolheram o número (prazo de 20 dias até o sorteio).
const linkMock = (id: string) => `https://rifa.exemplo.org/rifa/pagamento-aprovado?payment_id=${id}`;

// Alguns sem e-mail (o Mercado Pago nem sempre devolve): o painel mostra o
// nome de quem pagou e permite informar o e-mail.
export const pendentesEscolhaMock = (): PendenteEscolha[] => [
  { paymentId: "151245367001", email: "paula.nunes@exemplo.com", nomePagador: null, bancoPagador: "NU PAGAMENTOS S.A.", metodoPagamento: "pix", linkEscolha: linkMock("151245367001"), pagoEm: diasAtras(18), diasRestantes: 2 },
  { paymentId: "151245367002", email: null, nomePagador: null, bancoPagador: "BANCO BRADESCO S.A.", metodoPagamento: "pix", linkEscolha: linkMock("151245367002"), pagoEm: diasAtras(9), diasRestantes: 11 },
  { paymentId: "151245367003", email: null, nomePagador: "SOFIA LOPES", bancoPagador: null, metodoPagamento: "cartao", linkEscolha: linkMock("151245367003"), pagoEm: diasAtras(1), diasRestantes: 19 },
];

// Pix gerado e ainda não pago.
export const reservasMock = (): Reserva[] => [
  { paymentId: "151245367010", email: "tiago.moura@exemplo.com", nomePagador: null, bancoPagador: null, metodoPagamento: "pix", linkEscolha: linkMock("151245367010"), criadoEm: minutosAtras(6) },
  { paymentId: "151245367011", email: null, nomePagador: "VERA CAMPOS", bancoPagador: null, metodoPagamento: "cartao", linkEscolha: linkMock("151245367011"), criadoEm: minutosAtras(60 * 26) },
];

// Compras da Ação de Natal (números escolhidos antes de pagar).
const emMinutos = (m: number) => new Date(Date.now() + m * 60_000).toISOString();
export const pedidosMock = (): Pedido[] => [
  { pedidoId: "6f1c2a90-1111-4aaa-8bbb-000000000001", status: "PAGO", numeros: [12, 77, 140], numerosConfirmados: [12, 77, 140], numerosAEscolher: 0, valor: 300, metodo: "pix", mpPaymentId: "151245368001", nome: "Marina Alves", email: "marina.alves@exemplo.com", phone: "71988887777", criadoEm: minutosAtras(60 * 5), expiraEm: minutosAtras(60 * 4), pagoEm: minutosAtras(60 * 5 - 3), alertas: [], pagamentosExtras: [], utmSource: "INSTAGRAM" },
  { pedidoId: "6f1c2a90-1111-4aaa-8bbb-000000000002", status: "PAGO_PARCIAL", numeros: [230, 231], numerosConfirmados: [230], numerosAEscolher: 1, valor: 200, metodo: "cartao", mpPaymentId: "151245368002", nome: "Rafael Costa", email: "rafael.costa@exemplo.com", phone: "71977776666", criadoEm: minutosAtras(60 * 30), expiraEm: minutosAtras(60 * 29), pagoEm: minutosAtras(60 * 28), alertas: ["PAGO_APOS_EXPIRAR"], pagamentosExtras: [], utmSource: null },
  { pedidoId: "6f1c2a90-1111-4aaa-8bbb-000000000003", status: "PAGO", numeros: [5], numerosConfirmados: [5], numerosAEscolher: 0, valor: 100, metodo: "pix", mpPaymentId: "151245368003", nome: "Júlia Prado", email: "julia.prado@exemplo.com", phone: "71966665555", criadoEm: minutosAtras(60 * 50), expiraEm: minutosAtras(60 * 49), pagoEm: minutosAtras(60 * 50 - 2), alertas: ["PAGAMENTO_DUPLICADO"], pagamentosExtras: [{ mpPaymentId: "151245368099", valor: 100, em: minutosAtras(60 * 49) }], utmSource: "INSTAGRAM" },
  { pedidoId: "6f1c2a90-1111-4aaa-8bbb-000000000004", status: "AGUARDANDO_PAGAMENTO", numeros: [301, 302], numerosConfirmados: [], numerosAEscolher: 0, valor: 200, metodo: "pix", mpPaymentId: "151245368004", nome: "Caio Lima", email: "caio.lima@exemplo.com", phone: "71955554444", criadoEm: minutosAtras(4), expiraEm: emMinutos(28), pagoEm: null, alertas: [], pagamentosExtras: [], utmSource: null },
  { pedidoId: "6f1c2a90-1111-4aaa-8bbb-000000000005", status: "EXPIRADO", numeros: [88], numerosConfirmados: [], numerosAEscolher: 0, valor: 100, metodo: null, mpPaymentId: null, nome: null, email: null, phone: null, criadoEm: minutosAtras(60 * 3), expiraEm: minutosAtras(60 * 3 - 15), pagoEm: null, alertas: [], pagamentosExtras: [], utmSource: null },
];
