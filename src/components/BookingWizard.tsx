import React, { useState, useEffect } from 'react';
import {
  DogProfile,
  ScheduleOptions,
  Walker,
  BookingRecord,
  DogSize,
  DogGender,
  DogSociability,
  DogStrangerReaction,
  DogLeashReaction,
} from '../types';
import { DAYS_OF_WEEK, SHORT_DAYS, calculateWeeklyPrice } from '../data/walkers';
import { BookingSummaryCard } from './BookingSummaryCard';
import {
  X,
  ArrowLeft,
  ArrowRight,
  Check,
  Dog,
  Heart,
  Shield,
  MapPin,
  Calendar,
  Plus,
  User,
  Star,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Camera,
} from 'lucide-react';

interface BookingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  walkers: Walker[];
  initialWalkerId?: string | null;
  initialScheduleSettings?: {
    walksPerDay: number;
    selectedDays: string[];
    additionals: {
      secondDog: boolean;
      largeDog: boolean;
      soloWalk: boolean;
      sundayHoliday: boolean;
    };
  } | null;
  initialDog?: DogProfile;
  onBookingConfirmed: (booking: BookingRecord) => void;
}

const DOG_AVATARS = [
  { name: 'Golden Retriever', url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=300&q=80' },
  { name: 'Vira-lata Caramelo', url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=300&q=80' },
  { name: 'Bulldog Francês', url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=300&q=80' },
  { name: 'Poodle / Poodle Toy', url: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=300&q=80' },
  { name: 'Border Collie', url: 'https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?auto=format&fit=crop&w=300&q=80' },
  { name: 'Pug', url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=300&q=80' },
];

export const BookingWizard: React.FC<BookingWizardProps> = ({
  isOpen,
  onClose,
  walkers,
  initialWalkerId = null,
  initialScheduleSettings = null,
  initialDog,
  onBookingConfirmed,
}) => {
  // Wizard steps: 1 to 10
  // 1: Sobre seu cachorro
  // 2: Comportamento
  // 3: Cuidados
  // 4: Informações do passeio
  // 5: Quantidade de passeios & Horários
  // 6: Adicionais
  // 7: Resumo do preço
  // 8: Dados do responsável
  // 9: Escolher passeador
  // 10: Confirmação realizada
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Dog Profile State
  const [dog, setDog] = useState<DogProfile>(initialDog || {
    name: 'Thor',
    photoUrl: DOG_AVATARS[0].url,
    age: 3,
    breed: 'Golden Retriever',
    size: 'Médio',
    gender: 'Macho',
    neutered: true,
    // Comportamento
    sociableDogs: 'Muito sociável',
    strangerReaction: 'Tranquilo',
    pullsLeash: 'Às vezes',
    fears: ['Trovões / Fogos'],
    specialBehaviorNote: 'Adora brincar com bolinha e cheirar as árvores com calma.',
    // Cuidados
    hasRestrictions: false,
    hasAllergies: false,
    allergyDetails: '',
    specialCareInstructions: 'Oferecer água fresca na metade da caminhada.',
    avoidActions: 'Evitar contato com cães bravos ou barulhos de britadeira.',
    // Informações do passeio
    pickupAddress: 'Rua Oscar Freire, 1200 - Jardins, São Paulo',
    referencePoint: 'Portaria 2, interfone 42B',
    allowedLocations: ['Parque', 'Praça', 'Rua do bairro'],
    avoidLocations: 'Avenidas movimentadas',
  });

  // Sync if initialDog changes
  useEffect(() => {
    if (initialDog) {
      setDog((prev) => ({ ...prev, ...initialDog }));
    }
  }, [initialDog]);

  // Schedule State
  const [schedule, setSchedule] = useState<ScheduleOptions>({
    walksPerDay: initialScheduleSettings?.walksPerDay || 2,
    selectedDays: initialScheduleSettings?.selectedDays || [
      'Segunda-feira',
      'Quarta-feira',
      'Sexta-feira',
    ],
    walkTimes: ['08:00', '18:00'],
    additionals: initialScheduleSettings?.additionals || {
      secondDog: false,
      largeDog: false,
      soloWalk: false,
      sundayHoliday: false,
    },
    responsible: {
      fullName: 'Carlos Alberto Souza',
      phone: '(11) 99123-4567',
      email: 'carlos.souza@gmail.com',
      emergencyContact: 'Renata Souza (irmã) - (11) 98765-4321',
      agreedToTerms: true,
    },
    selectedWalkerId: initialWalkerId || 'walker-mariana',
  });

  // Success Confirmation State
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);

  // Synchronize initial settings if updated from simulator or walker modal
  useEffect(() => {
    if (initialScheduleSettings) {
      setSchedule((prev) => ({
        ...prev,
        walksPerDay: initialScheduleSettings.walksPerDay,
        selectedDays: initialScheduleSettings.selectedDays,
        additionals: initialScheduleSettings.additionals,
      }));
    }
    if (initialWalkerId) {
      setSchedule((prev) => ({
        ...prev,
        selectedWalkerId: initialWalkerId,
      }));
    }
  }, [initialScheduleSettings, initialWalkerId]);

  // Adjust default times dynamically when walksPerDay changes as requested in the prompt
  useEffect(() => {
    if (schedule.walksPerDay === 1) {
      setSchedule((prev) => ({ ...prev, walkTimes: [prev.walkTimes[0] || '09:00'] }));
    } else if (schedule.walksPerDay === 2) {
      setSchedule((prev) => ({ ...prev, walkTimes: ['08:00', '18:00'] }));
    } else if (schedule.walksPerDay === 3) {
      setSchedule((prev) => ({ ...prev, walkTimes: ['08:00', '13:00', '18:00'] }));
    }
  }, [schedule.walksPerDay]);

  // Auto-flag additional for large dogs if size is 'Grande'
  useEffect(() => {
    if (dog.size === 'Grande') {
      setSchedule((prev) => ({
        ...prev,
        additionals: { ...prev.additionals, largeDog: true },
      }));
    }
  }, [dog.size]);

  // Auto-flag additional for Sunday if 'Domingo' is in selected days
  useEffect(() => {
    if (schedule.selectedDays.includes('Domingo')) {
      setSchedule((prev) => ({
        ...prev,
        additionals: { ...prev.additionals, sundayHoliday: true },
      }));
    }
  }, [schedule.selectedDays]);

  if (!isOpen) return null;

  const toggleDay = (day: string) => {
    if (schedule.selectedDays.includes(day)) {
      if (schedule.selectedDays.length > 1) {
        setSchedule({
          ...schedule,
          selectedDays: schedule.selectedDays.filter((d) => d !== day),
        });
      }
    } else {
      setSchedule({
        ...schedule,
        selectedDays: [...schedule.selectedDays, day],
      });
    }
  };

  const toggleFear = (fear: string) => {
    if (dog.fears.includes(fear)) {
      setDog({
        ...dog,
        fears: dog.fears.filter((f) => f !== fear),
      });
    } else {
      setDog({
        ...dog,
        fears: [...dog.fears, fear],
      });
    }
  };

  const toggleLocation = (loc: string) => {
    if (dog.allowedLocations.includes(loc)) {
      if (dog.allowedLocations.length > 1) {
        setDog({
          ...dog,
          allowedLocations: dog.allowedLocations.filter((l) => l !== loc),
        });
      }
    } else {
      setDog({
        ...dog,
        allowedLocations: [...dog.allowedLocations, loc],
      });
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && !dog.name.trim()) {
      alert('Por favor, informe o nome do seu cão.');
      return;
    }
    if (currentStep === 4 && !dog.pickupAddress.trim()) {
      alert('Por favor, informe o endereço de busca.');
      return;
    }
    if (currentStep === 8) {
      if (!schedule.responsible.fullName || !schedule.responsible.phone || !schedule.responsible.email) {
        alert('Por favor, preencha nome, telefone e e-mail do responsável.');
        return;
      }
      if (!schedule.responsible.agreedToTerms) {
        alert('Você precisa aceitar os termos de serviço para continuar.');
        return;
      }
    }
    if (currentStep === 9) {
      handleFinalizeBooking();
      return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, 10));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFinalizeBooking = () => {
    const calc = calculateWeeklyPrice(
      schedule.walksPerDay,
      schedule.selectedDays,
      schedule.additionals
    );

    const chosenWalker =
      walkers.find((w) => w.id === schedule.selectedWalkerId) || walkers[0];

    const newBooking: BookingRecord = {
      id: `PET-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      dog,
      schedule,
      walker: chosenWalker,
      totalWalksWeekly: calc.totalWalks,
      basePriceWeekly: calc.baseTotal,
      additionalPriceWeekly: calc.additionalsTotal,
      totalPriceWeekly: calc.grandTotal,
      status: 'Confirmado',
    };

    setConfirmedBooking(newBooking);
    onBookingConfirmed(newBooking);
    setCurrentStep(10);
  };

  // Step Title map for progress indicator
  const stepTitles: Record<number, string> = {
    1: 'Sobre seu cachorro',
    2: 'Comportamento',
    3: 'Cuidados de saúde',
    4: 'Informações do passeio',
    5: 'Quantidade & Horários',
    6: 'Adicionais',
    7: 'Resumo do preço',
    8: 'Dados do responsável',
    9: 'Escolher passeador',
    10: 'Confirmação',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-[#FAF8F5] rounded-3xl max-w-5xl w-full max-h-[94vh] overflow-hidden shadow-2xl border border-stone-200 flex flex-col relative">
        
        {/* Top Header & Progress */}
        <div className="bg-white px-6 py-4 border-b border-stone-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {currentStep > 1 && currentStep < 10 && (
              <button
                type="button"
                onClick={prevStep}
                className="p-2 rounded-full hover:bg-stone-100 text-stone-600 transition-colors cursor-pointer"
                title="Voltar etapa anterior"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                Agendamento de Passeios · Etapa {currentStep} de 9
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 leading-tight">
                {stepTitles[currentStep] || 'Agendar passeio'}
              </h2>
            </div>
          </div>

          <button
            id="close-booking-wizard"
            onClick={onClose}
            className="p-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
            aria-label="Fechar formulário de agendamento"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-stone-200 h-1.5 shrink-0">
          <div
            className="bg-emerald-600 h-1.5 transition-all duration-300"
            style={{ width: `${(Math.min(currentStep, 9) / 9) * 100}%` }}
          />
        </div>

        {/* Scrollable Container with Split Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          {currentStep === 10 && confirmedBooking ? (
            /* Step 10: Final Success View */
            <div className="max-w-2xl mx-auto py-6 text-center space-y-6">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/20 animate-bounce-subtle">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Agendamento Confirmado com Sucesso!
                </span>
                <h3 className="text-3xl font-black text-stone-900">
                  {confirmedBooking.dog.name} vai passear com muito amor! 🐶
                </h3>
                <p className="text-stone-600 text-sm sm:text-base max-w-md mx-auto">
                  Reserva <strong>#{confirmedBooking.id}</strong> confirmada. O passeador <strong>{confirmedBooking.walker.name}</strong> já recebeu as informações da rotina.
                </p>
              </div>

              {/* Confirmation Details Card */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm text-left space-y-4 max-w-lg mx-auto">
                <div className="flex items-center gap-4 pb-4 border-b border-stone-100">
                  <img
                    src={confirmedBooking.walker.avatarUrl}
                    alt={confirmedBooking.walker.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-stone-200"
                  />
                  <div>
                    <h4 className="font-extrabold text-stone-900">
                      Passeador(a): {confirmedBooking.walker.name}
                    </h4>
                    <p className="text-xs text-stone-500">
                      ⭐ {confirmedBooking.walker.rating} ({confirmedBooking.walker.reviewsCount} avaliações)
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-stone-400 block font-medium">Cãozinho:</span>
                    <span className="font-bold text-stone-800 text-sm">{confirmedBooking.dog.name} ({confirmedBooking.dog.breed})</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block font-medium">Passeios por dia:</span>
                    <span className="font-bold text-stone-800 text-sm">{confirmedBooking.schedule.walksPerDay} passeio(s)</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block font-medium">Dias da semana:</span>
                    <span className="font-bold text-stone-800">
                      {confirmedBooking.schedule.selectedDays.map((d) => SHORT_DAYS[d]).join(', ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 block font-medium">Horários:</span>
                    <span className="font-bold text-stone-800">{confirmedBooking.schedule.walkTimes.join(' e ')}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-500 uppercase">Valor Semanal</span>
                  <span className="text-2xl font-black text-emerald-800">
                    R$ {confirmedBooking.totalPriceWeekly}/semana
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all cursor-pointer"
                >
                  Concluir e voltar ao início
                </button>
              </div>
            </div>
          ) : (
            /* Main 2-column layout: Form Content on Left, Sticky Summary on Right */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Form Content (8 cols on desktop) */}
              <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
                
                {/* ETAPA 1: SOBRE SEU CACHORRO */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="border-b border-stone-100 pb-3">
                      <h3 className="text-lg font-extrabold text-stone-900">
                        Etapa 1 — Sobre seu cachorro
                      </h3>
                      <p className="text-xs text-stone-500">
                        Conte para nós os dados básicos do seu melhor amigo
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Nome do cachorro */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-stone-700 block">
                          Nome do cachorro *
                        </label>
                        <input
                          type="text"
                          required
                          value={dog.name}
                          onChange={(e) => setDog({ ...dog, name: e.target.value })}
                          placeholder="Digite o nome do seu cachorro (ex.: Thor, Pipoca, Mel)"
                          className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:border-emerald-500 bg-stone-50/50 font-medium"
                        />
                      </div>

                      {/* Foto do cachorro com avatares rápidos ou link */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-stone-700 block">
                          Foto do cachorro
                        </label>
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-sm shrink-0 bg-stone-100">
                            <img
                              src={dog.photoUrl}
                              alt={dog.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-stone-500 mb-2">
                              Escolha um avatar que mais se parece com ele:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {DOG_AVATARS.map((av, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => setDog({ ...dog, photoUrl: av.url })}
                                  className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                                    dog.photoUrl === av.url
                                      ? 'border-emerald-600 scale-105 shadow-xs'
                                      : 'border-stone-200 opacity-70 hover:opacity-100'
                                  }`}
                                  title={av.name}
                                >
                                  <img src={av.url} alt={av.name} className="w-full h-full object-cover" />
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Idade & Raça */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-stone-700 block">
                            Idade (anos)
                          </label>
                          <input
                            type="number"
                            min={0}
                            max={25}
                            value={dog.age}
                            onChange={(e) =>
                              setDog({ ...dog, age: e.target.value === '' ? '' : Number(e.target.value) })
                            }
                            placeholder="3 anos"
                            className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:border-emerald-500 bg-stone-50/50"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-stone-700 block">
                            Raça
                          </label>
                          <input
                            type="text"
                            value={dog.breed}
                            onChange={(e) => setDog({ ...dog, breed: e.target.value })}
                            placeholder="Ex.: Golden Retriever, SRD / Vira-lata, Poodle..."
                            className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:border-emerald-500 bg-stone-50/50"
                          />
                        </div>
                      </div>

                      {/* Porte */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-stone-700 block">
                          Porte
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {(['Pequeno', 'Médio', 'Grande'] as DogSize[]).map((porte) => (
                            <button
                              key={porte}
                              type="button"
                              onClick={() => setDog({ ...dog, size: porte })}
                              className={`py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                                dog.size === porte
                                  ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-xs'
                                  : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                              }`}
                            >
                              <span>{porte === 'Pequeno' ? '🐩' : porte === 'Médio' ? '🐕' : '🦮'}</span>
                              <span>{porte}</span>
                              <span className="text-[10px] text-stone-400 font-normal">
                                {porte === 'Pequeno' ? 'até 10kg' : porte === 'Médio' ? '11 a 25kg' : 'mais de 25kg'}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Sexo & Castrado */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-stone-700 block">Sexo</label>
                          <div className="flex gap-4 pt-1">
                            {(['Macho', 'Fêmea'] as DogGender[]).map((gender) => (
                              <label key={gender} className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
                                <input
                                  type="radio"
                                  name="gender"
                                  checked={dog.gender === gender}
                                  onChange={() => setDog({ ...dog, gender })}
                                  className="text-emerald-600 focus:ring-emerald-500"
                                />
                                <span>{gender}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-stone-700 block">É castrado?</label>
                          <div className="flex gap-4 pt-1">
                            <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
                              <input
                                type="radio"
                                name="neutered"
                                checked={dog.neutered === true}
                                onChange={() => setDog({ ...dog, neutered: true })}
                                className="text-emerald-600 focus:ring-emerald-500"
                              />
                              Sim
                            </label>
                            <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
                              <input
                                type="radio"
                                name="neutered"
                                checked={dog.neutered === false}
                                onChange={() => setDog({ ...dog, neutered: false })}
                                className="text-emerald-600 focus:ring-emerald-500"
                              />
                              Não
                            </label>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* ETAPA 2: COMPORTAMENTO */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="border-b border-stone-100 pb-3">
                      <h3 className="text-lg font-extrabold text-stone-900">
                        Etapa 2 — Comportamento
                      </h3>
                      <p className="text-xs text-stone-500">
                        Essas respostas ajudam o passeador a planejar a melhor conduta
                      </p>
                    </div>

                    <div className="space-y-5">
                      {/* Sociável com outros cachorros */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-stone-700 block">
                          Ele é sociável com outros cachorros?
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {(['Muito sociável', 'Sociável', 'Às vezes', 'Não é sociável'] as DogSociability[]).map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => setDog({ ...dog, sociableDogs: opt })}
                              className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                                dog.sociableDogs === opt
                                  ? 'bg-emerald-600 text-white border-emerald-600'
                                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Reação a pessoas desconhecidas */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-stone-700 block">
                          Como ele reage a pessoas desconhecidas?
                        </label>
                        <div className="space-y-2">
                          {(['Tranquilo', 'Desconfiado', 'Medroso', 'Pode apresentar comportamento agressivo'] as DogStrangerReaction[]).map((reaction) => (
                            <label key={reaction} className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer text-xs sm:text-sm">
                              <input
                                type="radio"
                                name="strangerReaction"
                                checked={dog.strangerReaction === reaction}
                                onChange={() => setDog({ ...dog, strangerReaction: reaction })}
                                className="text-emerald-600 focus:ring-emerald-500"
                              />
                              <span className="font-medium text-stone-800">{reaction}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Costuma puxar a guia */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-stone-700 block">
                          Ele costuma puxar a guia?
                        </label>
                        <div className="flex gap-4">
                          {(['Sim', 'Não', 'Às vezes'] as DogLeashReaction[]).map((pull) => (
                            <label key={pull} className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
                              <input
                                type="radio"
                                name="pullsLeash"
                                checked={dog.pullsLeash === pull}
                                onChange={() => setDog({ ...dog, pullsLeash: pull })}
                                className="text-emerald-600 focus:ring-emerald-500"
                              />
                              <span>{pull}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Medos */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-stone-700 block">
                          Ele tem medo de alguma coisa?
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {['Barulhos', 'Carros', 'Pessoas', 'Outros cachorros', 'Chuva', 'Fogos', 'Outros'].map((f) => (
                            <label
                              key={f}
                              className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs font-semibold ${
                                dog.fears.includes(f)
                                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                                  : 'bg-stone-50 border-stone-200 text-stone-700'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={dog.fears.includes(f)}
                                onChange={() => toggleFear(f)}
                                className="w-3.5 h-3.5 text-amber-500 focus:ring-amber-400"
                              />
                              <span>{f}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Comportamento específico */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-stone-700 block">
                          Existe algum comportamento que o passeador precisa conhecer?
                        </label>
                        <textarea
                          rows={3}
                          value={dog.specialBehaviorNote}
                          onChange={(e) => setDog({ ...dog, specialBehaviorNote: e.target.value })}
                          placeholder="Conte aqui se ele pula de alegria ao colocar a coleira, se gosta de carinho na barriga, etc..."
                          className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:border-emerald-500 bg-stone-50/50"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ETAPA 3: CUIDADOS */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="border-b border-stone-100 pb-3">
                      <h3 className="text-lg font-extrabold text-stone-900">
                        Etapa 3 — Cuidados & Saúde
                      </h3>
                      <p className="text-xs text-stone-500">
                        Aqui vale incluir apenas informações necessárias para a segurança e o cuidado do animal.
                      </p>
                    </div>

                    <div className="space-y-5">
                      {/* Restrição para passear */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-stone-700 block">
                          Seu cachorro possui alguma restrição para passear?
                        </label>
                        <div className="flex gap-6">
                          <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
                            <input
                              type="radio"
                              name="restrictions"
                              checked={dog.hasRestrictions === false}
                              onChange={() => setDog({ ...dog, hasRestrictions: false })}
                              className="text-emerald-600 focus:ring-emerald-500"
                            />
                            Não
                          </label>
                          <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
                            <input
                              type="radio"
                              name="restrictions"
                              checked={dog.hasRestrictions === true}
                              onChange={() => setDog({ ...dog, hasRestrictions: true })}
                              className="text-emerald-600 focus:ring-emerald-500"
                            />
                            Sim
                          </label>
                        </div>
                      </div>

                      {/* Alergias */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-stone-700 block">
                          Possui alergias?
                        </label>
                        <div className="flex gap-6">
                          <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
                            <input
                              type="radio"
                              name="allergies"
                              checked={dog.hasAllergies === false}
                              onChange={() => setDog({ ...dog, hasAllergies: false })}
                              className="text-emerald-600 focus:ring-emerald-500"
                            />
                            Não
                          </label>
                          <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
                            <input
                              type="radio"
                              name="allergies"
                              checked={dog.hasAllergies === true}
                              onChange={() => setDog({ ...dog, hasAllergies: true })}
                              className="text-emerald-600 focus:ring-emerald-500"
                            />
                            Sim — Qual?
                          </label>
                        </div>

                        {dog.hasAllergies && (
                          <input
                            type="text"
                            value={dog.allergyDetails}
                            onChange={(e) => setDog({ ...dog, allergyDetails: e.target.value })}
                            placeholder="Digite aqui as alergias (ex: frango, grama sintética, picadas)"
                            className="w-full mt-2 px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-emerald-500 bg-stone-50/50"
                          />
                        )}
                      </div>

                      {/* Limitação ou cuidado especial */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-stone-700 block">
                          Tem alguma limitação ou cuidado especial?
                        </label>
                        <textarea
                          rows={2}
                          value={dog.specialCareInstructions}
                          onChange={(e) => setDog({ ...dog, specialCareInstructions: e.target.value })}
                          placeholder="Digite aqui (ex.: displasia leve na pata traseira, não correr muito no sol quente)"
                          className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:border-emerald-500 bg-stone-50/50"
                        />
                      </div>

                      {/* O que o passeador NÃO deve fazer */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-stone-700 block">
                          Existe alguma coisa que o passeador NÃO deve fazer?
                        </label>
                        <textarea
                          rows={2}
                          value={dog.avoidActions}
                          onChange={(e) => setDog({ ...dog, avoidActions: e.target.value })}
                          placeholder="Digite aqui (ex.: não dar petiscos de outros tutores, não soltar da guia em nenhuma hipótese)"
                          className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:border-emerald-500 bg-stone-50/50"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ETAPA 4: INFORMAÇÕES DO PASSEIO */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="border-b border-stone-100 pb-3">
                      <h3 className="text-lg font-extrabold text-stone-900">
                        Etapa 4 — Informações do passeio
                      </h3>
                      <p className="text-xs text-stone-500">
                        Onde o passeador busca o pet e quais locais ele pode frequentar
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Endereço de busca */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-stone-700 block">
                          Endereço de busca *
                        </label>
                        <input
                          type="text"
                          required
                          value={dog.pickupAddress}
                          onChange={(e) => setDog({ ...dog, pickupAddress: e.target.value })}
                          placeholder="Digite o endereço completo com número e bairro"
                          className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:border-emerald-500 bg-stone-50/50"
                        />
                      </div>

                      {/* Ponto de referência */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-stone-700 block">
                          Ponto de referência
                        </label>
                        <input
                          type="text"
                          value={dog.referencePoint}
                          onChange={(e) => setDog({ ...dog, referencePoint: e.target.value })}
                          placeholder="Ex.: portão azul, condomínio fechado, interfone 32..."
                          className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:border-emerald-500 bg-stone-50/50"
                        />
                      </div>

                      {/* Onde ele pode passear */}
                      <div className="space-y-2 pt-2">
                        <label className="text-xs font-bold text-stone-700 block">
                          Onde ele pode passear?
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {['Parque', 'Praça', 'Rua do bairro', 'Local escolhido pelo passeador', 'Outro'].map((loc) => (
                            <label
                              key={loc}
                              className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer text-xs font-semibold ${
                                dog.allowedLocations.includes(loc)
                                  ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                                  : 'bg-stone-50 border-stone-200 text-stone-700'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={dog.allowedLocations.includes(loc)}
                                onChange={() => toggleLocation(loc)}
                                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                              />
                              <span>{loc}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Locais a evitar */}
                      <div className="space-y-1.5 pt-2">
                        <label className="text-xs font-bold text-stone-700 block">
                          Existe algum local que você prefere evitar?
                        </label>
                        <input
                          type="text"
                          value={dog.avoidLocations}
                          onChange={(e) => setDog({ ...dog, avoidLocations: e.target.value })}
                          placeholder="Digite aqui (ex.: ruas com cães soltos em portão, perto de feira livre...)"
                          className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:border-emerald-500 bg-stone-50/50"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ETAPA 5: ESCOLHA DOS PASSEIOS & HORÁRIOS */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div className="border-b border-stone-100 pb-3">
                      <h3 className="text-lg font-extrabold text-stone-900">
                        Etapa 5 — Escolha dos passeios & Horários
                      </h3>
                      <p className="text-xs text-stone-500">
                        Como você gostaria dos passeios do seu cachorro?
                      </p>
                    </div>

                    {/* Quantos passeios por dia */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                        Quantos passeios por dia?
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {[1, 2, 3].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setSchedule({ ...schedule, walksPerDay: num })}
                            className={`py-3.5 px-4 rounded-2xl text-sm font-bold border transition-all cursor-pointer ${
                              schedule.walksPerDay === num
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                                : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                            }`}
                          >
                            [ {num} {num === 1 ? 'passeio' : 'passeios'} ]
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quais dias da semana */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                        Quais dias da semana?
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {DAYS_OF_WEEK.map((day) => {
                          const isChecked = schedule.selectedDays.includes(day);
                          return (
                            <label
                              key={day}
                              className={`flex items-center gap-2.5 p-3 rounded-2xl border cursor-pointer text-xs font-bold transition-all ${
                                isChecked
                                  ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs'
                                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleDay(day)}
                                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                              />
                              <span>{day}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Horários dinâmicos baseados na quantidade escolhida */}
                    <div className="space-y-3 pt-3 border-t border-stone-100">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                          Horários do passeio
                        </label>
                        <span className="text-xs text-stone-500 font-medium">
                          {schedule.walksPerDay} horário(s) por dia
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {schedule.walksPerDay === 1 && (
                          <div className="space-y-1">
                            <span className="text-xs font-semibold text-stone-600">Passeio 1:</span>
                            <select
                              value={schedule.walkTimes[0] || '09:00'}
                              onChange={(e) => setSchedule({ ...schedule, walkTimes: [e.target.value] })}
                              className="w-full p-2.5 rounded-xl border border-stone-200 text-sm font-bold text-stone-800 bg-stone-50"
                            >
                              <option value="07:00">07:00 (Manhã cedo)</option>
                              <option value="08:00">08:00</option>
                              <option value="09:00">09:00</option>
                              <option value="10:00">10:00</option>
                              <option value="16:00">16:00 (Tarde)</option>
                              <option value="17:00">17:00</option>
                              <option value="18:00">18:00</option>
                            </select>
                          </div>
                        )}

                        {schedule.walksPerDay === 2 && (
                          <>
                            <div className="space-y-1">
                              <span className="text-xs font-semibold text-stone-600">Passeio 1:</span>
                              <input
                                type="time"
                                value={schedule.walkTimes[0] || '08:00'}
                                onChange={(e) =>
                                  setSchedule({
                                    ...schedule,
                                    walkTimes: [e.target.value, schedule.walkTimes[1] || '18:00'],
                                  })
                                }
                                className="w-full p-2.5 rounded-xl border border-stone-200 text-sm font-bold text-stone-800 bg-stone-50"
                              />
                            </div>
                            <div className="space-y-1">
                              <span className="text-xs font-semibold text-stone-600">Passeio 2:</span>
                              <input
                                type="time"
                                value={schedule.walkTimes[1] || '18:00'}
                                onChange={(e) =>
                                  setSchedule({
                                    ...schedule,
                                    walkTimes: [schedule.walkTimes[0] || '08:00', e.target.value],
                                  })
                                }
                                className="w-full p-2.5 rounded-xl border border-stone-200 text-sm font-bold text-stone-800 bg-stone-50"
                              />
                            </div>
                          </>
                        )}

                        {schedule.walksPerDay === 3 && (
                          <>
                            <div className="space-y-1">
                              <span className="text-xs font-semibold text-stone-600">Passeio 1:</span>
                              <input
                                type="time"
                                value={schedule.walkTimes[0] || '08:00'}
                                onChange={(e) =>
                                  setSchedule({
                                    ...schedule,
                                    walkTimes: [e.target.value, schedule.walkTimes[1] || '13:00', schedule.walkTimes[2] || '18:00'],
                                  })
                                }
                                className="w-full p-2.5 rounded-xl border border-stone-200 text-sm font-bold text-stone-800 bg-stone-50"
                              />
                            </div>
                            <div className="space-y-1">
                              <span className="text-xs font-semibold text-stone-600">Passeio 2:</span>
                              <input
                                type="time"
                                value={schedule.walkTimes[1] || '13:00'}
                                onChange={(e) =>
                                  setSchedule({
                                    ...schedule,
                                    walkTimes: [schedule.walkTimes[0] || '08:00', e.target.value, schedule.walkTimes[2] || '18:00'],
                                  })
                                }
                                className="w-full p-2.5 rounded-xl border border-stone-200 text-sm font-bold text-stone-800 bg-stone-50"
                              />
                            </div>
                            <div className="space-y-1">
                              <span className="text-xs font-semibold text-stone-600">Passeio 3:</span>
                              <input
                                type="time"
                                value={schedule.walkTimes[2] || '18:00'}
                                onChange={(e) =>
                                  setSchedule({
                                    ...schedule,
                                    walkTimes: [schedule.walkTimes[0] || '08:00', schedule.walkTimes[1] || '13:00', e.target.value],
                                  })
                                }
                                className="w-full p-2.5 rounded-xl border border-stone-200 text-sm font-bold text-stone-800 bg-stone-50"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                  </div>
                )}

                {/* ETAPA 6: ADICIONAIS */}
                {currentStep === 6 && (
                  <div className="space-y-6">
                    <div className="border-b border-stone-100 pb-3">
                      <h3 className="text-lg font-extrabold text-stone-900">
                        Etapa 6 — Adicionais
                      </h3>
                      <p className="text-xs text-stone-500">
                        Deseja algum adicional? O sistema atualiza o preço automaticamente.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {/* Segundo cachorro */}
                      <label className="flex items-center justify-between p-4 rounded-2xl border border-stone-200 hover:bg-stone-50 cursor-pointer transition-all">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={schedule.additionals.secondDog}
                            onChange={(e) =>
                              setSchedule({
                                ...schedule,
                                additionals: { ...schedule.additionals, secondDog: e.target.checked },
                              })
                            }
                            className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500"
                          />
                          <div>
                            <span className="text-sm font-bold text-stone-900 block">
                              Segundo cachorro
                            </span>
                            <span className="text-xs text-stone-500">
                              Passeie dois cães da mesma residência juntos
                            </span>
                          </div>
                        </div>
                        <span className="text-sm font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
                          + R$ 15 / passeio
                        </span>
                      </label>

                      {/* Cachorro de grande porte */}
                      <label className="flex items-center justify-between p-4 rounded-2xl border border-stone-200 hover:bg-stone-50 cursor-pointer transition-all">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={schedule.additionals.largeDog}
                            onChange={(e) =>
                              setSchedule({
                                ...schedule,
                                additionals: { ...schedule.additionals, largeDog: e.target.checked },
                              })
                            }
                            className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500"
                          />
                          <div>
                            <span className="text-sm font-bold text-stone-900 block">
                              Cachorro de grande porte
                            </span>
                            <span className="text-xs text-stone-500">
                              Manejo especial e preparo para cães com mais de 25kg
                            </span>
                          </div>
                        </div>
                        <span className="text-sm font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
                          + R$ 10 / passeio
                        </span>
                      </label>

                      {/* Passeio individual */}
                      <label className="flex items-center justify-between p-4 rounded-2xl border border-stone-200 hover:bg-stone-50 cursor-pointer transition-all">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={schedule.additionals.soloWalk}
                            onChange={(e) =>
                              setSchedule({
                                ...schedule,
                                additionals: { ...schedule.additionals, soloWalk: e.target.checked },
                              })
                            }
                            className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500"
                          />
                          <div>
                            <span className="text-sm font-bold text-stone-900 block">
                              Passeio individual
                            </span>
                            <span className="text-xs text-stone-500">
                              Sem contato com nenhum outro cachorro durante todo o percurso
                            </span>
                          </div>
                        </div>
                        <span className="text-sm font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
                          + R$ 15 / passeio
                        </span>
                      </label>

                      {/* Domingo/feriado */}
                      <label className="flex items-center justify-between p-4 rounded-2xl border border-stone-200 hover:bg-stone-50 cursor-pointer transition-all">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={schedule.additionals.sundayHoliday}
                            onChange={(e) =>
                              setSchedule({
                                ...schedule,
                                additionals: { ...schedule.additionals, sundayHoliday: e.target.checked },
                              })
                            }
                            className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500"
                          />
                          <div>
                            <span className="text-sm font-bold text-stone-900 block">
                              Domingo / feriado
                            </span>
                            <span className="text-xs text-stone-500">
                              Remuneração especial de fim de semana
                            </span>
                          </div>
                        </div>
                        <span className="text-sm font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
                          + R$ 10 / passeio
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* ETAPA 7: RESUMO DO PREÇO */}
                {currentStep === 7 && (
                  <div className="space-y-6">
                    <div className="border-b border-stone-100 pb-3">
                      <h3 className="text-lg font-extrabold text-stone-900">
                        Etapa 7 — Resumo do Preço Semanal
                      </h3>
                      <p className="text-xs text-stone-500">
                        Confira como calculamos os valores da rotina escolhida
                      </p>
                    </div>

                    <div className="p-5 rounded-3xl bg-emerald-50/60 border border-emerald-200 space-y-4">
                      <h4 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
                        <span>🐶 Rotina de {dog.name}</span>
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                        <div className="bg-white p-3.5 rounded-2xl border border-stone-200">
                          <span className="text-stone-500 block">Frequência:</span>
                          <span className="font-bold text-stone-900">
                            {schedule.selectedDays.length} dias por semana ({schedule.walksPerDay}x ao dia)
                          </span>
                        </div>

                        <div className="bg-white p-3.5 rounded-2xl border border-stone-200">
                          <span className="text-stone-500 block">Total de passeios:</span>
                          <span className="font-bold text-stone-900">
                            {schedule.selectedDays.length * schedule.walksPerDay} passeios / semana
                          </span>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-2 text-xs sm:text-sm">
                        <div className="flex justify-between text-stone-600">
                          <span>Base por passeio:</span>
                          <span className="font-bold text-stone-900">R$ 25,00</span>
                        </div>
                        <div className="flex justify-between text-stone-600">
                          <span>Dias selecionados:</span>
                          <span className="font-semibold text-stone-800">
                            {schedule.selectedDays.map((d) => SHORT_DAYS[d]).join(', ')}
                          </span>
                        </div>
                        <div className="flex justify-between text-stone-600">
                          <span>Horários definidos:</span>
                          <span className="font-semibold text-stone-800">
                            {schedule.walkTimes.join(' e ')}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-stone-500 italic">
                        Na próxima etapa você preencherá seus dados de contato e em seguida poderá escolher seu passeador favorito!
                      </p>
                    </div>
                  </div>
                )}

                {/* ETAPA 8: DADOS DO RESPONSÁVEL */}
                {currentStep === 8 && (
                  <div className="space-y-6">
                    <div className="border-b border-stone-100 pb-3">
                      <h3 className="text-lg font-extrabold text-stone-900">
                        Etapa 8 — Dados do responsável
                      </h3>
                      <p className="text-xs text-stone-500">
                        Agora precisamos dos seus dados para contato e suporte durante os passeios
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Nome completo */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-stone-700 block">
                          Nome completo *
                        </label>
                        <input
                          type="text"
                          required
                          value={schedule.responsible.fullName}
                          onChange={(e) =>
                            setSchedule({
                              ...schedule,
                              responsible: { ...schedule.responsible, fullName: e.target.value },
                            })
                          }
                          placeholder="Digite seu nome completo"
                          className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:border-emerald-500 bg-stone-50/50"
                        />
                      </div>

                      {/* Telefone / WhatsApp */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-stone-700 block">
                          Telefone / WhatsApp *
                        </label>
                        <input
                          type="tel"
                          required
                          value={schedule.responsible.phone}
                          onChange={(e) =>
                            setSchedule({
                              ...schedule,
                              responsible: { ...schedule.responsible, phone: e.target.value },
                            })
                          }
                          placeholder="(11) 98765-4321"
                          className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:border-emerald-500 bg-stone-50/50"
                        />
                      </div>

                      {/* E-mail */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-stone-700 block">
                          E-mail *
                        </label>
                        <input
                          type="email"
                          required
                          value={schedule.responsible.email}
                          onChange={(e) =>
                            setSchedule({
                              ...schedule,
                              responsible: { ...schedule.responsible, email: e.target.value },
                            })
                          }
                          placeholder="seuemail@email.com"
                          className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:border-emerald-500 bg-stone-50/50"
                        />
                      </div>

                      {/* Contato de emergência */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-stone-700 block">
                          Contato de emergência (Nome + telefone)
                        </label>
                        <input
                          type="text"
                          value={schedule.responsible.emergencyContact}
                          onChange={(e) =>
                            setSchedule({
                              ...schedule,
                              responsible: { ...schedule.responsible, emergencyContact: e.target.value },
                            })
                          }
                          placeholder="Ex.: Patrícia (irmã) - (11) 99999-8888"
                          className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:border-emerald-500 bg-stone-50/50"
                        />
                      </div>

                      {/* Termos de serviço */}
                      <div className="pt-3">
                        <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-stone-200 bg-stone-50/50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={schedule.responsible.agreedToTerms}
                            onChange={(e) =>
                              setSchedule({
                                ...schedule,
                                responsible: { ...schedule.responsible, agreedToTerms: e.target.checked },
                              })
                            }
                            className="w-4 h-4 mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="text-xs text-stone-600 leading-relaxed">
                            Li e concordo com os <strong>termos de serviço</strong>, cobertura de emergência veterinária e política de cancelamento flexível do PasseioPet.
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* ETAPA 9: ESCOLHER PASSEADOR */}
                {currentStep === 9 && (
                  <div className="space-y-6">
                    <div className="border-b border-stone-100 pb-3">
                      <h3 className="text-lg font-extrabold text-stone-900">
                        Etapa 9 — Escolha seu passeador
                      </h3>
                      <p className="text-xs text-stone-500">
                        Veja os passeadores disponíveis na sua região e selecione o de sua preferência
                      </p>
                    </div>

                    <div className="space-y-3">
                      {walkers.map((walker) => {
                        const isSelected = schedule.selectedWalkerId === walker.id;
                        return (
                          <div
                            key={walker.id}
                            onClick={() => setSchedule({ ...schedule, selectedWalkerId: walker.id })}
                            className={`p-4 sm:p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                              isSelected
                                ? 'bg-emerald-50/70 border-emerald-600 shadow-md shadow-emerald-600/10'
                                : 'bg-white border-stone-200 hover:border-emerald-300'
                            }`}
                          >
                            <div className="flex items-center gap-3.5">
                              <img
                                src={walker.avatarUrl}
                                alt={walker.name}
                                className="w-14 h-14 rounded-2xl object-cover border border-stone-200"
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-extrabold text-stone-900 text-base">
                                    🐾 {walker.name}
                                  </h4>
                                  {walker.badge && (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-stone-900">
                                      {walker.badge}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-0.5">
                                  <span className="text-amber-500 font-bold flex items-center">
                                    <Star className="w-3 h-3 fill-amber-400 inline mr-0.5" />
                                    {walker.rating.toFixed(1)}
                                  </span>
                                  <span>· {walker.reviewsCount} avaliações</span>
                                  <span>· {walker.experienceYears} anos exp.</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                  {walker.tags.slice(0, 2).map((tg, i) => (
                                    <span key={i} className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md font-medium">
                                      {tg}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="shrink-0 flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                              <div className="text-right">
                                <span className="text-xs text-stone-400 block font-medium">Valor fixado</span>
                                <span className="text-base font-black text-stone-900">R$ {walker.pricePerWalk}/passeio</span>
                              </div>
                              <div
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                  isSelected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-stone-300'
                                }`}
                              >
                                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Mobile Bottom Navigation Button */}
                <div className="lg:hidden pt-4 border-t border-stone-200 flex gap-3">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-5 py-3 rounded-full border border-stone-300 text-stone-700 text-sm font-bold"
                    >
                      Voltar
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 py-3.5 rounded-full text-center text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md"
                  >
                    {currentStep === 9 ? 'Finalizar cadastro e agendar' : 'Continuar'}
                  </button>
                </div>

              </div>

              {/* Sticky Summary Card on Desktop (4 cols) */}
              <div className="hidden lg:block lg:col-span-4">
                <BookingSummaryCard
                  dog={dog}
                  schedule={schedule}
                  currentStep={currentStep}
                  totalSteps={9}
                  onNext={nextStep}
                  nextButtonLabel={currentStep === 9 ? 'Confirmar agendamento' : 'Continuar'}
                />
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
