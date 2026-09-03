import React, { useState } from 'react';
import { Walker } from '../types';
import { X, Star, ShieldCheck, MapPin, Calendar, Check, Award, Heart, MessageCircle } from 'lucide-react';

interface WalkerProfileModalProps {
  walker: Walker | null;
  onClose: () => void;
  onSelectWalkerForBooking: (walker: Walker) => void;
}

export const WalkerProfileModal: React.FC<WalkerProfileModalProps> = ({
  walker,
  onClose,
  onSelectWalkerForBooking,
}) => {
  const [imgError, setImgError] = useState(false);
  if (!walker) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 relative">
        
        {/* Close Button */}
        <button
          id="close-walker-modal"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Cover Banner */}
        <div className="h-32 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-t-3xl relative px-6 flex items-end">
          <div className="translate-y-10 flex items-end gap-4">
            <div className="w-24 h-24 rounded-2xl border-4 border-white overflow-hidden shadow-lg bg-stone-100 shrink-0">
              <img
                src={imgError ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80' : walker.avatarUrl}
                alt={walker.name}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="mb-2">
              <h3 className="text-2xl font-black text-stone-900 flex items-center gap-2">
                🐾 {walker.name}
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Passeador(a) Verificado(a) & Certificado(a)
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="pt-14 px-6 sm:px-8 pb-8 space-y-6">
          
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 text-center">
            <div>
              <div className="flex items-center justify-center gap-1 text-amber-500 font-extrabold text-base">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{walker.rating.toFixed(1)}</span>
              </div>
              <span className="text-[11px] text-stone-500 font-medium">
                {walker.reviewsCount} avaliações
              </span>
            </div>

            <div>
              <div className="text-base font-extrabold text-stone-900">
                {walker.experienceYears} anos
              </div>
              <span className="text-[11px] text-stone-500 font-medium">
                Experiência
              </span>
            </div>

            <div>
              <div className="text-base font-extrabold text-emerald-700">
                {walker.completedWalks}+
              </div>
              <span className="text-[11px] text-stone-500 font-medium">
                Passeios realizados
              </span>
            </div>

            <div>
              <div className="text-base font-extrabold text-stone-900">
                R$ {walker.pricePerWalk}
              </div>
              <span className="text-[11px] text-stone-500 font-medium">
                por passeio
              </span>
            </div>
          </div>

          {/* Apresentação */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
              <span>Apresentação & Biografia</span>
            </h4>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed bg-stone-50/70 p-4 rounded-2xl border border-stone-100">
              {walker.bio}
            </p>
          </div>

          {/* Região Atendida */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Região Atendida</span>
            </h4>
            <p className="text-sm text-stone-700 font-medium bg-emerald-50/60 text-emerald-900 px-4 py-2.5 rounded-xl border border-emerald-200/60 inline-block">
              {walker.coverageArea}
            </p>
          </div>

          {/* Disponibilidade & Porte de Cães */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-stone-600" />
                <span>Dias com Disponibilidade</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {walker.availabilityDays.map((d) => (
                  <span
                    key={d}
                    className="text-xs font-medium px-2.5 py-1 bg-stone-100 text-stone-700 rounded-lg"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-stone-600" />
                <span>Portes e Tipos Aceitos</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {walker.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200/80 rounded-lg"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Especialidades */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Especialidades e Habilidades
            </h4>
            <div className="flex flex-wrap gap-2">
              {walker.specialties.map((spec) => (
                <span
                  key={spec}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  {spec}
                </span>
              ))}
            </div>
          </div>

          {/* Avaliações recentes de clientes */}
          <div className="space-y-3 pt-2 border-t border-stone-100">
            <h4 className="text-sm font-bold text-stone-900 flex items-center justify-between">
              <span>Depoimentos de tutores</span>
              <span className="text-xs text-stone-400 font-normal">Todas as avaliações são verificadas</span>
            </h4>
            
            <div className="space-y-2.5">
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100 text-xs text-stone-600 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-800">Camila S. (tutora do Bob)</span>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p>
                  "Pontualíssima e muito carinhosa! O Bob fica esperando na porta nos dias de passeio. Recomendo de olhos fechados."
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100 text-xs text-stone-600 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-800">Rodrigo F. (tutor da Luna)</span>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p>
                  "As fotos enviadas durante o trajeto são ótimas e o percurso é sempre bem respeitado. Nota 10!"
                </p>
              </div>
            </div>
          </div>

          {/* Modal Action CTA */}
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-3 border-t border-stone-200">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-3 rounded-full border border-stone-300 text-sm font-semibold text-stone-700 hover:bg-stone-100 cursor-pointer"
            >
              Fechar perfil
            </button>

            <button
              id={`book-walker-${walker.id}`}
              onClick={() => {
                onClose();
                onSelectWalkerForBooking(walker);
              }}
              className="w-full sm:flex-1 py-3.5 rounded-full text-center text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/25 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Agendar passeios com {walker.name.split(' ')[0]}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
