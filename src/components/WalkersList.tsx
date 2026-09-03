import React, { useState } from 'react';
import { Walker, DogSize } from '../types';
import { Star, ShieldCheck, MapPin, Eye, Calendar, Sparkles, Filter, Search, Check, Globe, MessageCircle } from 'lucide-react';
import { BRAZILIAN_STATES, COUNTRIES } from '../utils/locations';
import { WHATSAPP_TARGET_NUMBER } from '../utils/pdfAndWhatsApp';

interface WalkersListProps {
  walkers: Walker[];
  onViewProfile: (walker: Walker) => void;
  onSelectWalkerForBooking: (walker: Walker) => void;
  selectedCountry?: string;
  selectedState?: string;
  onChangeLocation?: (country: string, state: string) => void;
  onOpenBecomeWalker?: () => void;
}

export const WalkersList: React.FC<WalkersListProps> = ({
  walkers,
  onViewProfile,
  onSelectWalkerForBooking,
  selectedCountry = 'Brasil',
  selectedState = 'ES',
  onChangeLocation,
  onOpenBecomeWalker,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<string>('Todos');
  const [filterByStateOnly, setFilterByStateOnly] = useState<boolean>(true);

  // Filter walkers by Country, State, Search Term and Dog Size
  const filteredWalkers = walkers.filter((walker) => {
    const matchesCountry =
      !filterByStateOnly ||
      !walker.country ||
      walker.country.toLowerCase() === selectedCountry.toLowerCase();

    const matchesState =
      !filterByStateOnly ||
      !walker.state ||
      walker.state.toUpperCase() === selectedState.toUpperCase();

    const matchesSearch =
      walker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      walker.coverageArea.toLowerCase().includes(searchTerm.toLowerCase()) ||
      walker.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (walker.city && walker.city.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSize =
      selectedSizeFilter === 'Todos' ||
      walker.dogSizesAccepted.includes(selectedSizeFilter as DogSize);

    return matchesCountry && matchesState && matchesSearch && matchesSize;
  });

  const stateObj = BRAZILIAN_STATES.find((s) => s.code === selectedState);
  const stateLabel = stateObj ? stateObj.name : selectedState;

  return (
    <section id="passeadores" className="py-16 md:py-24 bg-white border-t border-emerald-100/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ECFDF5] text-[#047857] border border-[#D1FAE5] text-xs font-bold uppercase tracking-wider">
            <span>⭐ Nossos Profissionais</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
            Passeadores dedicados e verificados
          </h2>
          <p className="text-base sm:text-lg text-[#4B5563]">
            Passeadores verificados e checados, treinados para passeios individuais ou em grupo com envio de relatório e fotos.
          </p>
        </div>

        {/* 🌟 PERGUNTA OBRIGATÓRIA: DE QUAL PAÍS E ESTADO VOCÊ É? */}
        <div className="mb-10 p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-emerald-50/80 via-white to-amber-50/50 border-2 border-emerald-200 shadow-sm max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
            
            <div className="space-y-1.5 max-w-md flex flex-col items-center lg:items-start">
              <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#047857]">
                <Globe className="w-4 h-4" />
                <span>Localização do Tutor</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-[#111827] flex items-center gap-2 justify-center lg:justify-start">
                <span>📍 De qual país e estado você é?</span>
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Selecione sua região para ver passeadores credenciados mais próximos de você e do seu pet.
              </p>
            </div>

            {/* Selectors */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              
              {/* País */}
              <div className="flex flex-col gap-1 min-w-[140px] flex-1 sm:flex-initial">
                <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                  País:
                </label>
                <div className="relative">
                  <select
                    id="select-pais-filtro"
                    value={selectedCountry}
                    onChange={(e) => {
                      if (onChangeLocation) {
                        onChangeLocation(e.target.value, selectedState);
                      }
                    }}
                    className="w-full pl-3 pr-8 py-2.5 rounded-2xl bg-white border border-emerald-300 text-xs sm:text-sm font-bold text-[#111827] shadow-xs focus:ring-2 focus:ring-[#047857]/30 outline-none cursor-pointer"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Estado */}
              <div className="flex flex-col gap-1 min-w-[200px] flex-1 sm:flex-initial">
                <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                  Estado:
                </label>
                <div className="relative">
                  <select
                    id="select-estado-filtro"
                    value={selectedState}
                    onChange={(e) => {
                      if (onChangeLocation) {
                        onChangeLocation(selectedCountry, e.target.value);
                      }
                    }}
                    className="w-full pl-3 pr-8 py-2.5 rounded-2xl bg-white border border-emerald-300 text-xs sm:text-sm font-bold text-[#111827] shadow-xs focus:ring-2 focus:ring-[#047857]/30 outline-none cursor-pointer"
                  >
                    {BRAZILIAN_STATES.map((st) => (
                      <option key={st.code} value={st.code}>
                        {st.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Toggle to show all or only current state */}
              <div className="flex flex-col gap-1 sm:self-end pt-1">
                <button
                  type="button"
                  id="btn-toggle-filtro-estado"
                  onClick={() => setFilterByStateOnly(!filterByStateOnly)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer shadow-xs ${
                    filterByStateOnly
                      ? 'bg-[#047857] text-white border-[#047857]'
                      : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>
                    {filterByStateOnly
                      ? `Mostrando só ${selectedState}`
                      : 'Mostrando todos os estados'}
                  </span>
                </button>
              </div>

            </div>

          </div>

          {/* Current Location Feedback Pill */}
          <div className="mt-4 pt-3 border-t border-emerald-100 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-600">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                {filterByStateOnly
                  ? `Mostrando ${filteredWalkers.length} passeador(es) em ${stateLabel} • ${selectedCountry}`
                  : `Mostrando ${filteredWalkers.length} passeadores em todo o Brasil`}
              </span>
            </span>

            <span className="text-[11px] text-stone-500">
              Central WhatsApp: <strong>{WHATSAPP_TARGET_NUMBER}</strong>
            </span>
          </div>
        </div>

        {/* Search and Filters with UI Kit Chips */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 max-w-5xl mx-auto">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome, bairro ou cidade..."
              className="pl-9 pr-4 py-2.5 rounded-full border border-stone-200 text-sm focus:outline-none focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/20 w-full bg-stone-50/70 text-[#111827]"
            />
          </div>

          {/* Chips de múltipla escolha: Fundo cinza neutro inativo; verde escuro (#047857) ativo com check */}
          <div className="flex items-center justify-center gap-1.5 bg-[#F9FAF7] p-1.5 rounded-full border border-stone-200/70 overflow-x-auto max-w-full">
            {['Todos', 'Pequeno', 'Médio', 'Grande'].map((size) => {
              const isSelected = selectedSizeFilter === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSizeFilter(size)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#047857] text-white shadow-xs'
                      : 'bg-stone-100 text-[#4B5563] hover:text-[#111827]'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  <span>{size}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Walkers Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredWalkers.map((walker) => (
            <div
              key={walker.id}
              id={`walker-card-${walker.id}`}
              className="bg-[#F9FAF7] rounded-3xl p-6 border border-emerald-100/70 hover:border-emerald-300 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-xl hover:shadow-[#047857]/5 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Header with Photo & Badge */}
                <div className="relative mb-5">
                  <div className="w-22 h-22 rounded-2xl overflow-hidden shadow-md mx-auto bg-stone-200 border-2 border-white">
                    <img
                      src={walker.avatarUrl}
                      alt={walker.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  {walker.badge && (
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#F59E0B] text-[#111827] text-[10px] font-extrabold px-3 py-0.5 rounded-full shadow-xs whitespace-nowrap">
                      {walker.badge}
                    </span>
                  )}
                </div>

                {/* Name */}
                <h3 className="text-xl font-black text-[#111827] text-center flex items-center justify-center gap-1 mb-1">
                  🐾 {walker.name.split(' ')[0]}
                </h3>

                {/* State & Country Location Badge */}
                <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-[#047857] mb-2 bg-emerald-50/90 py-0.5 px-2.5 rounded-full w-fit mx-auto border border-emerald-200/60">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span>
                    {walker.city ? `${walker.city}, ` : ''}{walker.state || 'ES'} • {walker.country || 'Brasil'}
                  </span>
                </div>

                {/* Rating & Reviews */}
                <div className="flex items-center justify-center gap-1.5 text-xs text-[#4B5563] mb-3">
                  <span className="flex items-center text-[#F59E0B] font-extrabold gap-0.5">
                    <Star className="w-3.5 h-3.5 fill-[#F59E0B]" />
                    {walker.rating.toFixed(1)}
                  </span>
                  <span>·</span>
                  <span className="text-[#4B5563]">{walker.reviewsCount} avaliações</span>
                </div>

                {/* Experience */}
                <div className="text-xs font-bold text-[#111827] bg-white py-1.5 px-3 rounded-2xl border border-stone-200/60 text-center mb-4 shadow-[0_2px_6px_rgba(0,0,0,0.02)]">
                  <span className="text-[#4B5563] font-normal">Experiência:</span> {walker.experienceYears} anos
                </div>

                {/* Tags */}
                <div className="space-y-1.5 mb-5">
                  {walker.tags.map((tag, idx) => (
                    <div
                      key={idx}
                      className="text-xs text-[#111827] font-medium flex items-center gap-1.5"
                    >
                      <span className="text-[#047857] font-bold">✓</span>
                      <span>{tag.replace('✓', '').trim()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & Action Buttons */}
              <div className="pt-4 border-t border-stone-200/80 space-y-3">
                <div className="text-center">
                  <span className="text-xl font-black text-[#111827]">
                    R$ {walker.pricePerWalk}
                  </span>
                  <span className="text-xs font-bold text-[#4B5563]"> / passeio</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onViewProfile(walker)}
                    className="py-2.5 px-3 rounded-full text-xs font-bold text-[#111827] bg-white hover:bg-stone-100 border border-stone-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-stone-500" />
                    <span>Ver perfil</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectWalkerForBooking(walker)}
                    className="py-2.5 px-3 rounded-full text-xs font-bold text-white bg-[#047857] hover:bg-[#065F46] shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Agendar 🐾</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Empty state when no walkers match state */}
        {filteredWalkers.length === 0 && (
          <div className="text-center py-12 px-4 bg-[#F9FAF7] rounded-3xl border-2 border-dashed border-stone-300 max-w-xl mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-xl font-bold">
              📍
            </div>
            <h4 className="text-lg font-black text-[#111827]">
              Nenhum passeador cadastrado ainda em {stateLabel}
            </h4>
            <p className="text-[#4B5563] text-sm leading-relaxed">
              Você pode ver passeadores de outros estados ou ser o primeiro passeador credenciado no seu estado!
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setFilterByStateOnly(false)}
                className="px-5 py-2.5 rounded-full text-xs font-bold bg-white text-stone-800 border border-stone-300 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                Ver todos os estados
              </button>
              {onOpenBecomeWalker && (
                <button
                  type="button"
                  onClick={onOpenBecomeWalker}
                  className="px-5 py-2.5 rounded-full text-xs font-bold bg-[#047857] text-white hover:bg-[#065F46] transition-all shadow-xs cursor-pointer"
                >
                  Quero ser Passeador em {selectedState}
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
