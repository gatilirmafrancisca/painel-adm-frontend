const SEXOTYPES = ['Macho', 'Fêmea'] as const;
type SexoType = typeof SEXOTYPES[number];

const CORTYPES = [
    'Frajola',
    'Tigrado',
    'Laranja',
    'Escaminha',
    'Tricolor',
    'Preto Sólido',
    'Branco Sólido',
    'Cinza Sólido',
    'Sialata',
    'Branco com Tigrado',
    'Branco com Laranja'

] as const;
type CorType = typeof CORTYPES[number];



const FIVFELVTYPES = ['Negativo', 'FIV+', 'FeLV+', 'FIV+ FeLV+'] as const;
type FivFeLVType = typeof FIVFELVTYPES[number];



const PERSONALIDADETYPES = [
    'Afetuoso', 'Sociável', 'Tímido', 'Independente', 'Gato de Colo', 
  'Brincalhão', 'Ativo', 'Calmo', 'Explorador', 
  'Amigo de Gatos', 'Amigo de Cães', 'Paciente com Crianças', 'Gato Único',
  'Vocal', 'Silencioso', 'Destemido'
] as const;
type PersonalidadeType = typeof PERSONALIDADETYPES[number];



const STATUSTYPES = ['Disponível', 'Em Tratamento', 'Reservado', 'Adotado'] as const;
type StatusType = typeof STATUSTYPES[number];

type Gato = {
    id: string,
    nome: string,
    idade: number,
    sexo: SexoType,
    cor: CorType,
    castrado: boolean,
    vacinado: boolean,
    vermifugado: boolean,
    fivFelv: FivFeLVType,
    personalidade: PersonalidadeType[],
    necessidadesEspeciais: boolean,
    descricaoBio: string,
    status: StatusType,
    imagemUrl: string
}

export type { SexoType, CorType, FivFeLVType, PersonalidadeType, StatusType, Gato };