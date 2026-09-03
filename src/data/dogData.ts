import { DogProfile } from '../types';

export const PERSONALITY_OPTIONS = [
  'Calmo',
  'Brincalhão',
  'Agitado',
  'Medroso',
  'Sociável',
  'Tímido',
  'Protetor',
];

export const STRANGER_OPTIONS = [
  'Muito tranquilo',
  'Tranquilo',
  'Fica com medo',
  'Fica agitado',
  'Pode tentar morder',
] as const;

export const OTHER_DOGS_OPTIONS = [
  'Adora outros cães',
  'Normalmente tranquilo',
  'Precisa de um período para se acostumar',
  'Não gosta de outros cães',
  'Não pode ficar perto de outros cães',
] as const;

export const PULL_LEASH_OPTIONS = [
  'Não',
  'Às vezes',
  'Sim, bastante',
] as const;

export const ESCAPE_LEASH_OPTIONS = [
  'Não',
  'Às vezes',
  'Sim',
] as const;

export const TRAFFIC_REACTION_OPTIONS = [
  'Ignora',
  'Fica assustado',
  'Fica agitado',
  'Tenta correr atrás',
] as const;

export const OTHER_ANIMALS_OPTIONS = [
  'Normal',
  'Fica curioso',
  'Late',
  'Tenta correr atrás',
  'Pode ficar agressivo',
] as const;

export const FEAR_OPTIONS = [
  'Fogos de artifício',
  'Trovão',
  'Chuva',
  'Carros',
  'Pessoas',
  'Outros cachorros',
  'Barulhos altos',
  'Bicicletas/motos',
];

export const EQUIPMENT_OPTIONS = [
  'Coleira',
  'Peitoral',
  'Coleira + peitoral',
] as const;

export const FAVORITE_ACTIVITIES_OPTIONS = [
  'Caminhar bastante',
  'Brincar',
  'Cheirar e explorar',
  'Encontrar outros cachorros',
  'Ficar em lugares tranquilos',
  'Correr',
];

export const DOG_AVATARS = [
  { name: 'Golden Retriever', url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=300&q=80' },
  { name: 'Vira-lata Caramelo', url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=300&q=80' },
  { name: 'Bulldog Francês', url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=300&q=80' },
  { name: 'Poodle / Poodle Toy', url: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=300&q=80' },
  { name: 'Border Collie', url: 'https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?auto=format&fit=crop&w=300&q=80' },
  { name: 'Pug', url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=300&q=80' },
  { name: 'Pastor Alemão', url: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=300&q=80' },
  { name: 'Shih Tzu', url: 'https://images.unsplash.com/photo-1591768575198-88dac53fbd0a?auto=format&fit=crop&w=300&q=80' },
];

export const DEFAULT_DOG_PROFILE: DogProfile = {
  // 1. Informações básicas
  name: 'Thor',
  photoUrl: DOG_AVATARS[0].url,
  age: 3,
  breed: 'Golden Retriever',
  size: 'Médio',
  gender: 'Macho',
  neutered: true,
  country: 'Brasil',
  state: 'ES',
  city: 'Vitória',

  // 2. Personalidade 🐾
  personalityTraits: ['Brincalhão', 'Sociável', 'Calmo'],
  personalityOther: '',
  strangerReaction: 'Tranquilo',
  dogReaction: 'Adora outros cães',

  // 3. Comportamento durante o passeio 🚶
  pullsLeash: 'Às vezes',
  escapesLeash: 'Não',
  reactionBikesCars: 'Ignora',
  reactionOtherAnimals: 'Fica curioso',
  walkerNeedsToKnowBehavior: 'Adora parar para cheirar árvores e postes com calma. Muito dócil e curioso com outros cães.',

  // 4. Medos e coisas que devem ser evitadas ⚠️
  fears: ['Fogos de artifício', 'Trovão'],
  fearsOther: '',
  placesSituationsToAvoid: 'Avenidas com trânsito pesado e obras barulhentas com britadeiras.',

  // 5. Saúde e cuidados ❤️
  hasHealthInfo: false,
  healthInfoDetails: '',
  hasAllergies: false,
  allergyDetails: '',
  hasWalkingRestrictions: false,
  walkingRestrictionsDetails: '',
  hasSpecialCare: true,
  specialCareDetails: 'Oferecer água fresca na volta do passeio e fazer pequenas pausas na sombra nos dias quentes.',

  // 6. Guia e equipamentos 🦮
  equipmentType: 'Peitoral',
  equipmentOther: '',
  specialEquipmentNotes: 'Usa peitoral acolchoado e guia reforçada com amortecedor.',

  // 7. Preferências do cachorro 🐕
  favoriteActivities: ['Caminhar bastante', 'Brincar', 'Cheirar e explorar'],
  favoriteActivitiesOther: '',
  makesDogHappy: 'Brincar com bolinha de tênis e receber carinho na barriga ao chegar do passeio.',

  // 8. Alimentação e recompensas 🍖
  canReceiveTreats: true,
  forbiddenFoods: 'Não pode comer alimentos condimentados ou restos caídos no chão da rua.',

  // Confirmação e LGPD
  confirmedSafetyTerms: true,
  marketingPhotosConsent: false, // Por padrão desmarcado (Opt-in explícito conforme Art. 7 e 18 da LGPD)

  // Endereço de busca e compatibilidade
  pickupAddress: 'Rua Oscar Freire, 1200 - Jardins, São Paulo',
  referencePoint: 'Portão azul, interfone 42B',
  allowedLocations: ['Parque Ibirapuera', 'Praça Buenos Aires'],
  avoidLocations: 'Avenidas movimentadas',
  specialBehaviorNote: 'Muito brincalhão e adora correr na grama.',
  specialCareInstructions: 'Oferecer água fresca na volta.',
  avoidActions: 'Não deixar comer restos de comida no chão.',
  hasRestrictions: false,
  sociableDogs: 'Muito sociável',
};
