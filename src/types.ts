export type DogSize = 'Pequeno' | 'Médio' | 'Grande';
export type DogGender = 'Macho' | 'Fêmea';

export type DogStrangerBehavior = 
  | 'Muito tranquilo'
  | 'Tranquilo'
  | 'Fica com medo'
  | 'Fica agitado'
  | 'Pode tentar morder';

export type DogOtherDogsBehavior =
  | 'Adora outros cães'
  | 'Normalmente tranquilo'
  | 'Precisa de um período para se acostumar'
  | 'Não gosta de outros cães'
  | 'Não pode ficar perto de outros cães';

export type LeashPullBehavior = 'Não' | 'Às vezes' | 'Sim, bastante';
export type LeashEscapeBehavior = 'Não' | 'Às vezes' | 'Sim';

export type TrafficReaction = 'Ignora' | 'Fica assustado' | 'Fica agitado' | 'Tenta correr atrás';
export type AnimalsReaction = 'Normal' | 'Fica curioso' | 'Late' | 'Tenta correr atrás' | 'Pode ficar agressivo';

export type EquipmentType = 'Coleira' | 'Peitoral' | 'Coleira + peitoral' | 'Outro';

// Backwards compatibility aliases
export type DogStrangerReaction = DogStrangerBehavior | string;
export type DogSociability = DogOtherDogsBehavior | string;
export type DogLeashReaction = LeashPullBehavior | string;

export interface DogProfile {
  // 1. Informações básicas
  name: string;
  photoUrl: string;
  age: number | '';
  breed: string;
  size: DogSize;
  gender: DogGender;
  neutered: boolean;
  country?: string; // Ex: 'Brasil'
  state?: string;   // Ex: 'ES', 'SP', 'RJ'
  city?: string;

  // 2. Personalidade 🐾
  personalityTraits: string[]; // Calmo, Brincalhão, Agitado, Medroso, Sociável, Tímido, Protetor, Outro
  personalityOther?: string;
  strangerReaction: DogStrangerBehavior;
  dogReaction: DogOtherDogsBehavior;

  // 3. Comportamento durante o passeio 🚶
  pullsLeash: LeashPullBehavior;
  escapesLeash: LeashEscapeBehavior;
  reactionBikesCars: TrafficReaction;
  reactionOtherAnimals: AnimalsReaction;
  walkerNeedsToKnowBehavior: string;

  // 4. Medos e coisas que devem ser evitadas ⚠️
  fears: string[]; // Fogos de artifício, Trovão, Chuva, Carros, Pessoas, Outros cachorros, Barulhos altos, Bicicletas/motos, Outros
  fearsOther?: string;
  placesSituationsToAvoid: string;

  // 5. Saúde e cuidados ❤️
  hasHealthInfo: boolean;
  healthInfoDetails?: string;
  hasAllergies: boolean;
  allergyDetails: string;
  hasWalkingRestrictions: boolean;
  walkingRestrictionsDetails?: string;
  hasSpecialCare: boolean;
  specialCareDetails?: string;

  // 6. Guia e equipamentos 🦮
  equipmentType: EquipmentType;
  equipmentOther?: string;
  specialEquipmentNotes: string;

  // 7. Preferências do cachorro 🐕
  favoriteActivities: string[]; // Caminhar bastante, Brincar, Cheirar e explorar, Encontrar outros cachorros, Ficar em lugares tranquilos, Correr, Outro
  favoriteActivitiesOther?: string;
  makesDogHappy: string;

  // 8. Alimentação e recompensas 🍖
  canReceiveTreats: boolean;
  forbiddenFoods: string;

  // Confirmação e Consentimentos LGPD
  confirmedSafetyTerms: boolean;
  marketingPhotosConsent?: boolean; // Consentimento explícito e destacado para fotos de marketing (não pré-marcado)

  // Endereço e compatibilidade com agendamento
  pickupAddress?: string;
  referencePoint?: string;
  allowedLocations?: string[];
  avoidLocations?: string;
  specialBehaviorNote?: string;
  specialCareInstructions?: string;
  avoidActions?: string;
  hasRestrictions?: boolean;
  sociableDogs?: any;
}

export interface ScheduleOptions {
  walksPerDay: number; // 1, 2, 3
  selectedDays: string[]; // ['Segunda-feira', 'Quarta-feira', 'Sexta-feira']
  walkTimes: string[]; // ['08:00', '18:00']
  additionals: {
    secondDog: boolean;
    largeDog: boolean;
    soloWalk: boolean;
    sundayHoliday: boolean;
  };
  responsible: {
    fullName: string;
    phone: string;
    email: string;
    emergencyContact: string;
    agreedToTerms: boolean;
  };
  selectedWalkerId: string | null;
}

export interface Walker {
  id: string;
  name: string;
  avatarUrl: string;
  country: string; // Ex: 'Brasil'
  state: string;   // Ex: 'ES', 'SP', 'RJ'
  city: string;
  rating: number;
  reviewsCount: number;
  experienceYears: number;
  tags: string[];
  pricePerWalk: number;
  badge?: string;
  bio: string;
  coverageArea: string;
  completedWalks: number;
  availabilityDays: string[];
  dogSizesAccepted: DogSize[];
  walkTypes: string[];
  specialties: string[];
}

export interface BookingRecord {
  id: string;
  createdAt: string;
  dog: DogProfile;
  schedule: ScheduleOptions;
  walker: Walker;
  totalWalksWeekly: number;
  basePriceWeekly: number;
  additionalPriceWeekly: number;
  totalPriceWeekly: number;
  status: 'Confirmado' | 'Em andamento' | 'Concluído';
}

export type WalkerStatus = 'Em análise' | 'Passeador aprovado' | 'Cadastro pendente';

export interface WalkerApplication {
  // 1. Dados pessoais e identificação civil
  fullName: string;
  birthDate: string;
  cpf: string;
  phone: string;
  email: string;
  photoUrl: string;
  identityDocumentFileName?: string; // Documento de Identidade (RG ou CNH)
  identityDocumentUrl?: string;

  // 2. Endereço
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  country?: string;
  residenceProofFileName?: string;
  residenceProofUrl?: string;

  // 3. Certidão de antecedentes criminais
  criminalRecordFileName?: string;
  criminalRecordUrl?: string;
  criminalRecordIssueDate: string;
  criminalRecordIssuingAuthority: string;

  // 4. Experiência com animais 🐕
  workedWithDogsBefore: boolean;
  experienceDuration: 'Menos de 1 ano' | '1 a 2 anos' | '3 a 5 anos' | 'Mais de 5 anos' | string;
  workedAsWalkerBefore: boolean;
  largeDogsExperience: boolean;
  difficultBehaviorExperience: boolean;
  multipleDogsExperience: boolean;

  // 5. Tipos de cães que aceita
  dogSizesAccepted: string[]; // Pequeno, Médio, Grande
  acceptsMultipleDogs: boolean;
  maxDogsPerWalk: number;

  // 6. Disponibilidade 📅
  availableDays: string[];
  startTime: string;
  endTime: string;
  maxWalksPerDay: number;

  // 7. Região de atendimento 📍
  neighborhoodsServed: string;
  canTravelToOtherRegions: boolean;
  transportMethod: 'A pé' | 'Bicicleta' | 'Moto' | 'Carro' | 'Transporte público' | 'Outro' | string;

  // 8. Segurança
  comfortableEnteringClientHome: boolean;
  comfortableWithEmergencies: boolean;
  hasBasicDogCareKnowledge: boolean;

  // 9. Apresentação
  aboutMe: string;

  // 10. Documentos para aprovação 📄
  documentsSubmitted: {
    idDocument: boolean;
    cpf: boolean;
    residenceProof: boolean;
    criminalRecord: boolean;
    profilePhoto: boolean;
  };
  status: WalkerStatus;
  pendingReason?: string;

  // Compatibilidade legada
  neighborhoodCity?: string;
  specialNeedsExperience?: boolean;
  availableHours?: string;
  dogSizes?: string[];
  walkModes?: string[];
  aboutExperience?: string;
}
