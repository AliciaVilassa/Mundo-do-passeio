import { Walker } from '../types';

export const INITIAL_WALKERS: Walker[] = [
  {
    id: 'walker-mateus-es',
    name: 'Mateus Oliveira',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    country: 'Brasil',
    state: 'ES',
    city: 'Vitória',
    rating: 5.0,
    reviewsCount: 148,
    experienceYears: 4,
    tags: ['✓ Cães pequenos', '✓ Cães médios', '✓ Orla e parques'],
    pricePerWalk: 25,
    badge: 'Super Passeador ES',
    bio: 'Passeador e adestrador certificado atuando na Grande Vitória (Praia do Canto, Jardim da Penha, Mata da Praia e Orla de Camburi). Garantia de hidratação, passeios seguros e fotos em tempo real no WhatsApp.',
    coverageArea: 'Vitória: Praia do Canto, Jardim da Penha, Mata da Praia e Camburi',
    completedWalks: 920,
    availabilityDays: ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
    dogSizesAccepted: ['Pequeno', 'Médio'],
    walkTypes: ['Individual', 'Em grupo'],
    specialties: ['Reforço positivo', 'Passeios na orla', 'Primeiros socorros pet'],
  },
  {
    id: 'walker-larissa-es',
    name: 'Larissa Ferreira',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    country: 'Brasil',
    state: 'ES',
    city: 'Vila Velha',
    rating: 4.9,
    reviewsCount: 112,
    experienceYears: 3,
    tags: ['✓ Todos os portes', '✓ Praia da Costa', '✓ Muito carinhosa'],
    pricePerWalk: 25,
    badge: 'Destaque Vila Velha',
    bio: 'Bióloga e apaixonada por cães de todos os portes. Atendimento carinhoso e cuidadoso em Vila Velha e região metropolitana, respeitando o ritmo e a segurança do seu pet.',
    coverageArea: 'Vila Velha: Praia da Costa, Itapuã, Itaparica e Centro',
    completedWalks: 670,
    availabilityDays: ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Domingo'],
    dogSizesAccepted: ['Pequeno', 'Médio', 'Grande'],
    walkTypes: ['Individual'],
    specialties: ['Socialização calma', 'Cães idosos', 'Controle térmico'],
  },
  {
    id: 'walker-mariana',
    name: 'Mariana Silva',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    country: 'Brasil',
    state: 'SP',
    city: 'São Paulo',
    rating: 4.9,
    reviewsCount: 126,
    experienceYears: 3,
    tags: ['✓ Cães pequenos', '✓ Cães médios', '✓ Passeios individuais'],
    pricePerWalk: 25,
    badge: 'Super Passeadora SP',
    bio: 'Apaixonada por cães desde a infância e certificada em Comportamento Canino e Primeiros Socorros Veterinários. Garanto passeios estimulantes, seguros e com envio de fotos e mapa em tempo real.',
    coverageArea: 'São Paulo: Jardins, Pinheiros, Vila Madalena e Perdizes',
    completedWalks: 840,
    availabilityDays: ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
    dogSizesAccepted: ['Pequeno', 'Médio'],
    walkTypes: ['Individual', 'Em grupo'],
    specialties: ['Reforço positivo', 'Cães idosos', 'Primeiros socorros pet'],
  },
  {
    id: 'walker-lucas',
    name: 'Lucas Mendes',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    country: 'Brasil',
    state: 'SP',
    city: 'São Paulo',
    rating: 5.0,
    reviewsCount: 98,
    experienceYears: 4,
    tags: ['✓ Cães grandes', '✓ Cães médios', '✓ Alto gasto de energia'],
    pricePerWalk: 25,
    badge: 'Especialista em Cães Ativos',
    bio: 'Educador canino e preparador físico pet. Tenho foco especial em raças de alta energia (Border Collies, Golden Retrievers, Pastores e Labradores). Cada passeio é planejado para o equilíbrio mental e físico.',
    coverageArea: 'São Paulo: Ibirapuera, Moema, Vila Mariana e Saúde',
    completedWalks: 620,
    availabilityDays: ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Domingo'],
    dogSizesAccepted: ['Médio', 'Grande'],
    walkTypes: ['Individual', 'Em grupo'],
    specialties: ['Gasto de energia', 'Controle na guia', 'Cães de grande porte'],
  },
  {
    id: 'walker-camila',
    name: 'Camila Rocha',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    country: 'Brasil',
    state: 'RJ',
    city: 'Rio de Janeiro',
    rating: 4.9,
    reviewsCount: 142,
    experienceYears: 5,
    tags: ['✓ Todos os portes', '✓ Cães tímidos', '✓ Passeios carinhosos'],
    pricePerWalk: 25,
    badge: 'Favorita no Rio',
    bio: 'Bióloga e tutora de 3 resgatados. Tenho paciência especial com cães tímidos, medrosos ou que necessitam de adaptação gradual. Respeito rigorosamente o ritmo e as pausas de cada pet na Zona Sul.',
    coverageArea: 'Rio de Janeiro: Leblon, Ipanema, Copacabana e Botafogo',
    completedWalks: 1100,
    availabilityDays: ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'],
    dogSizesAccepted: ['Pequeno', 'Médio', 'Grande'],
    walkTypes: ['Individual'],
    specialties: ['Cães medrosos', 'Socialização progressiva', 'Hidratação e pausas'],
  },
  {
    id: 'walker-rafael',
    name: 'Rafael Albuquerque',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    country: 'Brasil',
    state: 'MG',
    city: 'Belo Horizonte',
    rating: 4.8,
    reviewsCount: 84,
    experienceYears: 2,
    tags: ['✓ Cães pequenos', '✓ Brincadeiras no parque', '✓ Passeios em grupo'],
    pricePerWalk: 25,
    badge: 'Muito Atencioso BH',
    bio: 'Estudante de Medicina Veterinária. Adoro proporcionar momentos felizes ao ar livre, estimulação olfativa e sempre levo brinquedos higienizados para enriquecimento ambiental em Belo Horizonte.',
    coverageArea: 'Belo Horizonte: Savassi, Funcionários, Lourdes e Sion',
    completedWalks: 430,
    availabilityDays: ['Segunda-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
    dogSizesAccepted: ['Pequeno', 'Médio'],
    walkTypes: ['Individual', 'Em grupo'],
    specialties: ['Enriquecimento ambiental', 'Cuidado veterinário preventivo'],
  }
];

export const DAYS_OF_WEEK = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
  'Domingo',
];

export const SHORT_DAYS: Record<string, string> = {
  'Segunda-feira': 'Seg',
  'Terça-feira': 'Ter',
  'Quarta-feira': 'Qua',
  'Quinta-feira': 'Qui',
  'Sexta-feira': 'Sex',
  'Sábado': 'Sáb',
  'Domingo': 'Dom',
};

export const PRICING_CONSTANTS = {
  BASE_PER_WALK: 25,
  EXTRA_SECOND_DOG: 15,
  EXTRA_LARGE_DOG: 10,
  EXTRA_SOLO_WALK: 15,
  EXTRA_SUNDAY_HOLIDAY: 10,
};

export function calculateWeeklyPrice(
  walksPerDay: number,
  selectedDays: string[],
  additionals: {
    secondDog: boolean;
    largeDog: boolean;
    soloWalk: boolean;
    sundayHoliday: boolean;
  }
) {
  const totalDays = selectedDays.length;
  const totalWalks = totalDays * walksPerDay;

  const baseTotal = totalWalks * PRICING_CONSTANTS.BASE_PER_WALK;

  // Additional fees are applied per walk
  let additionalPerWalk = 0;
  if (additionals.secondDog) additionalPerWalk += PRICING_CONSTANTS.EXTRA_SECOND_DOG;
  if (additionals.largeDog) additionalPerWalk += PRICING_CONSTANTS.EXTRA_LARGE_DOG;
  if (additionals.soloWalk) additionalPerWalk += PRICING_CONSTANTS.EXTRA_SOLO_WALK;
  if (additionals.sundayHoliday) additionalPerWalk += PRICING_CONSTANTS.EXTRA_SUNDAY_HOLIDAY;

  const additionalsTotal = totalWalks * additionalPerWalk;
  const grandTotal = baseTotal + additionalsTotal;

  return {
    totalDays,
    totalWalks,
    baseTotal,
    additionalPerWalk,
    additionalsTotal,
    grandTotal,
  };
}
