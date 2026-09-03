import React, { useState } from 'react';
import { BookingRecord, DogProfile } from '../types';
import { DEFAULT_DOG_PROFILE } from '../data/dogData';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle2,
  ShieldCheck,
  Phone,
  Trash2,
  Mail,
  Dog,
  Heart,
  AlertCircle,
  Sparkles,
  Award,
  Edit3,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { SHORT_DAYS } from '../data/walkers';

interface TutorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: BookingRecord[];
  onCancelBooking: (id: string) => void;
  onNewBookingClick: () => void;
  dog?: DogProfile;
  onEditDog?: () => void;
  userEmail?: string;
}

export const TutorProfileModal: React.FC<TutorProfileModalProps> = ({
  isOpen,
  onClose,
  bookings,
  onCancelBooking,
  onNewBookingClick,
  dog,
  onEditDog,
  userEmail = 'mundodopasseio@gmail.com',
}) => {
  const [activeTab, setActiveTab] = useState<'agendamentos' | 'pet' | 'conta'>('agendamentos');

  const currentDog: DogProfile = dog || (bookings[0]?.dog ? bookings[0].dog : DEFAULT_DOG_PROFILE);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-emerald-100/60 relative p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          id="close-profile-modal"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-5 border-b border-stone-100">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-[#ECFDF5] border-2 border-emerald-200 flex items-center justify-center text-2xl font-black text-[#047857] shadow-sm">
              CA
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#047857] border-2 border-white ring-1 ring-emerald-200" title="Online" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-xl sm:text-2xl font-black text-[#111827] tracking-tight">
                Carlos Alberto Souza
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#047857] text-xs font-bold border border-[#D1FAE5]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#047857]" />
                <span>Tutor Verificado</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#4B5563]">
              <span className="flex items-center gap-1 font-medium">
                <Mail className="w-3.5 h-3.5 text-stone-400" />
                {userEmail}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-stone-400" />
                (11) 99123-4567
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation Pill */}
        <div className="flex items-center gap-1 bg-[#F9FAF7] p-1.5 rounded-2xl border border-stone-200/60 my-5">
          <button
            onClick={() => setActiveTab('agendamentos')}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'agendamentos'
                ? 'bg-[#047857] text-white shadow-xs'
                : 'text-[#4B5563] hover:text-[#111827]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Agendamentos ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('pet')}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'pet'
                ? 'bg-[#047857] text-white shadow-xs'
                : 'text-[#4B5563] hover:text-[#111827]'
            }`}
          >
            <Dog className="w-4 h-4" />
            <span>Meu Pet ({currentDog.name || 'Pet'})</span>
          </button>

          <button
            onClick={() => setActiveTab('conta')}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'conta'
                ? 'bg-[#047857] text-white shadow-xs'
                : 'text-[#4B5563] hover:text-[#111827]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Minha Conta</span>
          </button>
        </div>

        {/* Tab 1: Agendamentos */}
        {activeTab === 'agendamentos' && (
          <div className="space-y-4 animate-fadeIn">
            {bookings.length === 0 ? (
              <div className="text-center py-10 space-y-4 bg-[#F9FAF7] rounded-3xl border border-dashed border-stone-300 p-8">
                <div className="text-4xl">🐕</div>
                <h3 className="text-base font-extrabold text-[#111827]">
                  Nenhum agendamento ativo no momento
                </h3>
                <p className="text-xs sm:text-sm text-[#4B5563] max-w-sm mx-auto">
                  Agende a rotina ideal de passeios para o seu cão com profissionais certificados.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onNewBookingClick();
                  }}
                  className="px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-[#047857] hover:bg-[#065F46] shadow-md shadow-[#047857]/20 transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Agendar novo passeio</span>
                </button>
              </div>
            ) : (
              bookings.map((booking) => (
                <div
                  key={booking.id}
                  id={`booking-card-${booking.id}`}
                  className="p-5 rounded-3xl border border-emerald-100/70 bg-[#F9FAF7] hover:border-emerald-300 transition-all space-y-4 shadow-sm"
                >
                  {/* Header: Dog info & status badge */}
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200/60">
                    <div className="flex items-center gap-3">
                      <img
                        src={booking.dog.photoUrl}
                        alt={booking.dog.name}
                        className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-xs"
                      />
                      <div>
                        <h4 className="font-extrabold text-[#111827] text-base flex items-center gap-1.5">
                          <span>🐶</span> {booking.dog.name}
                        </h4>
                        <p className="text-xs text-[#4B5563]">
                          {booking.dog.breed} · Porte {booking.dog.size} · {booking.dog.age} anos
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#ECFDF5] text-[#047857] border border-[#D1FAE5] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {booking.status}
                    </span>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-white rounded-2xl border border-stone-100 space-y-1 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                      <span className="text-stone-400 font-semibold block">Passeador(a) Designado(a):</span>
                      <span className="font-bold text-[#111827] text-sm flex items-center gap-1.5">
                        🐾 {booking.walker.name}
                      </span>
                      <span className="text-[11px] text-[#4B5563] block">
                        Região: {booking.walker.coverageArea.split(',')[0]}
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-2xl border border-stone-100 space-y-1 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                      <span className="text-stone-400 font-semibold block">Frequência e Horários:</span>
                      <span className="font-bold text-[#111827]">
                        {booking.schedule.walksPerDay}x ao dia · {booking.schedule.selectedDays.map((d) => SHORT_DAYS[d]).join(', ')}
                      </span>
                      <span className="text-[11px] text-[#047857] font-bold block">
                        Horários: {booking.schedule.walkTimes.join(', ')}
                      </span>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="text-xs text-[#4B5563] bg-white p-3 rounded-2xl border border-stone-100 space-y-1">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                      <span><strong className="text-[#111827]">Endereço de busca:</strong> {booking.dog.pickupAddress}</span>
                    </div>
                    {booking.dog.referencePoint && (
                      <div className="text-[11px] text-stone-400 pl-5">
                        Ponto de ref.: {booking.dog.referencePoint}
                      </div>
                    )}
                  </div>

                  {/* Pricing & Actions */}
                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-stone-200/70">
                    <div>
                      <span className="text-[10px] text-stone-400 font-bold uppercase block">
                        Valor semanal cobrado:
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-[#047857]">
                          R$ {booking.totalPriceWeekly}
                        </span>
                        <span className="text-xs text-[#4B5563]">
                          ({booking.totalWalksWeekly} passeios/semana)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onCancelBooking(booking.id)}
                        className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                        title="Cancelar este agendamento"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Cancelar</span>
                      </button>

                      <a
                        href={`https://wa.me/5511999999999?text=Olá, sou tutor do ${booking.dog.name} no PasseioPet!`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#047857] hover:bg-[#065F46] transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Falar no WhatsApp</span>
                      </a>
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Meu Pet */}
        {activeTab === 'pet' && (
          <div className="space-y-5 animate-fadeIn">
            {/* Main Dog Card */}
            <div className="p-5 rounded-3xl bg-[#F9FAF7] border border-emerald-100/70 space-y-5">
              
              {/* Top Bar with Photo, Name and Edit Questionnaire Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/60">
                <div className="flex items-center gap-4">
                  <img
                    src={currentDog.photoUrl || 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=300&q=80'}
                    alt={currentDog.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-black text-[#111827]">{currentDog.name}</h3>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#047857] font-bold border border-[#D1FAE5]">
                        {currentDog.neutered ? 'Castrado' : 'Não castrado'}
                      </span>
                    </div>
                    <p className="text-xs text-[#4B5563] mt-0.5">
                      {currentDog.breed || 'SRD'} · {currentDog.age ? `${currentDog.age} anos` : 'Idade não informada'} · {currentDog.gender} · Porte {currentDog.size}
                    </p>
                  </div>
                </div>

                {onEditDog && (
                  <button
                    id="btn-edit-questionnaire-from-profile"
                    onClick={onEditDog}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#047857] hover:bg-[#065F46] transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer self-start sm:self-auto"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editar Questionário 🐶</span>
                  </button>
                )}
              </div>

              {/* 2. Personalidade 🐾 */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#111827]">
                  <span>🐾 Personalidade & Convivência</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {currentDog.personalityTraits && currentDog.personalityTraits.length > 0 ? (
                    currentDog.personalityTraits.map((trait) => (
                      <span
                        key={trait}
                        className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-xs font-semibold text-[#111827]"
                      >
                        ✓ {trait}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-stone-400">Nenhum traço selecionado</span>
                  )}
                  {currentDog.personalityOther && (
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-[#047857]">
                      Outro: {currentDog.personalityOther}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-3 bg-white rounded-2xl border border-stone-100">
                    <span className="text-stone-400 block font-semibold text-[11px]">Com pessoas desconhecidas:</span>
                    <span className="font-bold text-[#111827]">{currentDog.strangerReaction || 'Tranquilo'}</span>
                  </div>
                  <div className="p-3 bg-white rounded-2xl border border-stone-100">
                    <span className="text-stone-400 block font-semibold text-[11px]">Com outros cachorros:</span>
                    <span className="font-bold text-[#111827]">{currentDog.dogReaction || 'Adora outros cães'}</span>
                  </div>
                </div>
              </div>

              {/* 3. Comportamento no Passeio 🚶 */}
              <div className="space-y-2.5 pt-2 border-t border-stone-200/60">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#111827]">
                  <span>🚶 Durante o Passeio</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 bg-white rounded-2xl border border-stone-100">
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">Puxa a guia:</span>
                    <span className="font-bold text-[#111827]">{currentDog.pullsLeash || 'Às vezes'}</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-2xl border border-stone-100">
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">Tenta escapar:</span>
                    <span className="font-bold text-[#111827]">{currentDog.escapesLeash || 'Não'}</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-2xl border border-stone-100">
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">Bicicletas / Motos:</span>
                    <span className="font-bold text-[#111827]">{currentDog.reactionBikesCars || 'Ignora'}</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-2xl border border-stone-100">
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">Outros animais:</span>
                    <span className="font-bold text-[#111827]">{currentDog.reactionOtherAnimals || 'Fica curioso'}</span>
                  </div>
                </div>

                {currentDog.walkerNeedsToKnowBehavior && (
                  <div className="p-3 bg-white rounded-2xl border border-stone-100 text-xs">
                    <span className="text-stone-400 block font-semibold text-[11px] mb-0.5">
                      Comportamento que o passeador precisa conhecer:
                    </span>
                    <p className="font-medium text-[#111827]">{currentDog.walkerNeedsToKnowBehavior}</p>
                  </div>
                )}
              </div>

              {/* 4. Medos & Situações a Evitar ⚠️ */}
              <div className="space-y-2.5 pt-2 border-t border-stone-200/60">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                  <span>⚠️ Medos e Situações a Evitar</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {currentDog.fears && currentDog.fears.length > 0 ? (
                    currentDog.fears.map((f) => (
                      <span
                        key={f}
                        className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-800"
                      >
                        ⚡ {f}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-stone-400">Nenhum medo crítico informado</span>
                  )}
                  {currentDog.fearsOther && (
                    <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-800">
                      Outro: {currentDog.fearsOther}
                    </span>
                  )}
                </div>

                {currentDog.placesSituationsToAvoid && (
                  <div className="p-3 bg-white rounded-2xl border border-stone-100 text-xs">
                    <span className="text-stone-400 block font-semibold text-[11px] mb-0.5">
                      Locais ou situações a evitar:
                    </span>
                    <p className="font-medium text-amber-900">{currentDog.placesSituationsToAvoid}</p>
                  </div>
                )}
              </div>

              {/* 5. Saúde e Cuidados ❤️ */}
              <div className="space-y-2.5 pt-2 border-t border-stone-200/60">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#111827]">
                  <span>❤️ Saúde e Cuidados</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-3 bg-white rounded-2xl border border-stone-100">
                    <span className="text-stone-400 block text-[11px] font-semibold">Possui alergia?</span>
                    <span className="font-bold text-[#111827]">
                      {currentDog.hasAllergies ? `Sim: ${currentDog.allergyDetails}` : 'Não'}
                    </span>
                  </div>
                  <div className="p-3 bg-white rounded-2xl border border-stone-100">
                    <span className="text-stone-400 block text-[11px] font-semibold">Restrições no passeio:</span>
                    <span className="font-bold text-[#111827]">
                      {currentDog.hasWalkingRestrictions ? `Sim: ${currentDog.walkingRestrictionsDetails}` : 'Não'}
                    </span>
                  </div>
                </div>

                {currentDog.hasSpecialCare && currentDog.specialCareDetails && (
                  <div className="p-3 bg-white rounded-2xl border border-stone-100 text-xs">
                    <span className="text-stone-400 block font-semibold text-[11px] mb-0.5">
                      Cuidado especial necessário:
                    </span>
                    <p className="font-medium text-[#111827]">{currentDog.specialCareDetails}</p>
                  </div>
                )}
              </div>

              {/* 6. Guia e Equipamentos 🦮 */}
              <div className="space-y-2 pt-2 border-t border-stone-200/60">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#111827]">
                  <span>🦮 Guia e Equipamento</span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-stone-100 text-xs flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-stone-400 block text-[11px]">Equipamento usual:</span>
                    <span className="font-bold text-[#111827]">
                      {currentDog.equipmentType || 'Peitoral'}
                      {currentDog.equipmentOther ? ` (${currentDog.equipmentOther})` : ''}
                    </span>
                  </div>
                  {currentDog.specialEquipmentNotes && (
                    <div className="text-xs text-[#4B5563]">
                      Nota: {currentDog.specialEquipmentNotes}
                    </div>
                  )}
                </div>
              </div>

              {/* 7. Preferências 🐕 & 8. Alimentação 🍖 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-200/60 text-xs">
                <div className="p-3 bg-white rounded-2xl border border-stone-100 space-y-1.5">
                  <span className="font-bold text-[#111827] block">🐕 Preferências no Passeio:</span>
                  <div className="flex flex-wrap gap-1">
                    {currentDog.favoriteActivities && currentDog.favoriteActivities.length > 0 ? (
                      currentDog.favoriteActivities.map((act) => (
                        <span key={act} className="px-2 py-0.5 rounded bg-stone-100 text-[11px] font-medium text-stone-700">
                          {act}
                        </span>
                      ))
                    ) : (
                      <span className="text-stone-400 text-xs">Caminhar e brincar</span>
                    )}
                  </div>
                  {currentDog.makesDogHappy && (
                    <p className="text-[11px] text-[#4B5563] pt-1">
                      <strong>Deixa feliz:</strong> {currentDog.makesDogHappy}
                    </p>
                  )}
                </div>

                <div className="p-3 bg-white rounded-2xl border border-stone-100 space-y-1.5">
                  <span className="font-bold text-[#111827] block">🍖 Alimentação e Petiscos:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-stone-400 text-[11px]">Pode petiscos?</span>
                    <span className="font-bold text-[#047857]">
                      {currentDog.canReceiveTreats ? '✓ Sim' : '✗ Não'}
                    </span>
                  </div>
                  {currentDog.forbiddenFoods && (
                    <p className="text-[11px] text-rose-700 pt-1">
                      <strong>Proibido:</strong> {currentDog.forbiddenFoods}
                    </p>
                  )}
                </div>
              </div>

              {/* Safety Confirmation Badge */}
              <div className="p-3 bg-[#ECFDF5] rounded-2xl border border-[#D1FAE5] text-xs flex items-center justify-between text-[#047857] font-semibold">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#047857] shrink-0" />
                  <span>Questionário de Segurança Verificado pelo Tutor</span>
                </div>
                <span className="text-[11px] text-[#065F46] font-bold">100% Preenchido</span>
              </div>

            </div>
          </div>
        )}

        {/* Tab 3: Minha Conta & Suporte */}
        {activeTab === 'conta' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-5 rounded-3xl bg-[#F9FAF7] border border-stone-200/70 space-y-4">
              <h3 className="font-extrabold text-[#111827] text-sm">Dados Cadastrais</h3>
              
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between p-3 bg-white rounded-2xl border border-stone-100">
                  <span className="text-stone-400">Nome:</span>
                  <span className="font-bold text-[#111827]">Carlos Alberto Souza</span>
                </div>
                <div className="flex justify-between p-3 bg-white rounded-2xl border border-stone-100">
                  <span className="text-stone-400">E-mail:</span>
                  <span className="font-bold text-[#111827]">{userEmail}</span>
                </div>
                <div className="flex justify-between p-3 bg-white rounded-2xl border border-stone-100">
                  <span className="text-stone-400">Telefone:</span>
                  <span className="font-bold text-[#111827]">(11) 99123-4567</span>
                </div>
                <div className="flex justify-between p-3 bg-white rounded-2xl border border-stone-100">
                  <span className="text-stone-400">Endereço Principal:</span>
                  <span className="font-bold text-[#111827]">Rua Oscar Freire, 1200 - Jardins, São Paulo</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#ECFDF5] border border-[#D1FAE5] flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#047857] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#047857]">Seguro Veterinário PasseioPet 24h</h4>
                  <p className="text-[11px] text-emerald-900/80 leading-relaxed">
                    Sua conta possui cobertura emergencial gratuita durante qualquer passeio agendado pela plataforma.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-6 mt-6 border-t border-stone-200 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onNewBookingClick();
            }}
            className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#047857] hover:bg-[#065F46] shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <Calendar className="w-4 h-4" />
            <span>Agendar Novo Passeio</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
