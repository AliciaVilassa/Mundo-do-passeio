import React, { useState } from 'react';
import { Calendar, HeartHandshake, ShieldCheck, Star, CheckCircle2, ArrowRight, Sparkles, Image as ImageIcon } from 'lucide-react';
import heroWalkerImg from '../assets/images/hero_dog_walker_1788460922017.jpg';

interface HeroProps {
  onOpenBooking: () => void;
  onOpenBecomeWalker: () => void;
  onOpenDogQuestionnaire?: () => void;
  dogName?: string;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenBooking,
  onOpenBecomeWalker,
  onOpenDogQuestionnaire,
  dogName = 'Thor',
}) => {
  // Lista de imagens com alta definição, cores vivas e composição perfeitamente centralizada
  const images = [
    {
      id: 'generated',
      title: 'Passeio Oficial no Parque',
      url: heroWalkerImg,
    },
    {
      id: 'photo-park',
      title: 'Parque Ensolarado',
      url: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1600&q=85',
    },
    {
      id: 'photo-dogs',
      title: 'Cães Felizes ao Ar Livre',
      url: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1600&q=85',
    },
  ];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const activeImage = images[activeImageIndex];

  return (
    <section id="hero-section" className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24">
      {/* Subtle organic background decoration */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-emerald-100/35 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-amber-100/35 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-6 space-y-8 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Trust badge with Verde Menta / Sálvia Suave (#ECFDF5 / #D1FAE5) */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] text-[#047857] text-xs sm:text-sm font-bold shadow-xs mx-auto lg:mx-0">
              <ShieldCheck className="w-4 h-4 text-[#047857]" />
              <span>Passeadores 100% checados e avaliados com carinho</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-[#111827] leading-[1.15] tracking-tight">
                Seu cachorro merece um passeio cheio de alegria. <span className="inline-block" role="img" aria-label="cachorro">🐶</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-[#4B5563] font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
                Encontre um passeador de confiança e escolha os dias e horários que funcionam para você.
              </p>
            </div>

            {/* CTAs com tamanho ergonômico, ícones de avanço e micro-interações */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2 w-full sm:w-auto">
              <button
                id="hero-cta-agendar"
                onClick={onOpenBooking}
                className="w-full sm:w-auto px-8 py-4 rounded-full text-base sm:text-lg font-bold text-white bg-[#047857] hover:bg-[#065F46] active:scale-[0.98] shadow-lg shadow-[#047857]/25 transition-all flex items-center justify-center gap-3 cursor-pointer group"
              >
                <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Agendar um passeio</span>
                <span className="text-xl leading-none">🐾</span>
              </button>

              <button
                id="hero-cta-passeador"
                onClick={onOpenBecomeWalker}
                className="w-full sm:w-auto px-7 py-4 rounded-full text-base sm:text-lg font-bold text-[#111827] bg-white hover:bg-stone-50 border-2 border-stone-200 hover:border-[#F59E0B] active:scale-[0.98] shadow-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer group"
              >
                <HeartHandshake className="w-5 h-5 text-[#F59E0B]" />
                <span>Quero ser passeador</span>
                <ArrowRight className="w-4 h-4 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Social proof metrics with Âmbar (#F59E0B) */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-200/80 max-w-lg w-full mx-auto lg:mx-0 text-center">
              <div className="flex flex-col items-center lg:items-start">
                <div className="text-2xl sm:text-3xl font-black text-[#111827] flex items-center justify-center lg:justify-start">
                  4.9 <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B] ml-1 inline" />
                </div>
                <div className="text-xs sm:text-sm text-[#4B5563] font-medium">Nota dos tutores</div>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <div className="text-2xl sm:text-3xl font-black text-[#047857]">
                  +12k
                </div>
                <div className="text-xs sm:text-sm text-[#4B5563] font-medium">Passeios felizes</div>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <div className="text-2xl sm:text-3xl font-black text-[#111827]">
                  100%
                </div>
                <div className="text-xs sm:text-sm text-[#4B5563] font-medium">Com rastreamento</div>
              </div>
            </div>
          </div>

          {/* Right Column: Centered & Enhanced Hero Image */}
          <div className="lg:col-span-6 flex items-center justify-center w-full">
            <div className="relative w-full max-w-lg lg:max-w-xl mx-auto flex flex-col items-center">
              
              {/* Outer decorative ambient glow */}
              <div className="absolute -inset-3 bg-gradient-to-tr from-emerald-300/40 via-teal-200/30 to-amber-300/35 rounded-[36px] blur-xl -z-10" />

              {/* Main Centered Image Frame */}
              <div className="relative w-full rounded-[30px] overflow-hidden shadow-2xl shadow-emerald-950/15 border-4 border-white bg-stone-100 aspect-[16/10] flex items-center justify-center">
                <img
                  id="hero-walker-image"
                  src={activeImage.url}
                  alt="Passeador profissional caminhando com cães felizes no parque sob luz natural e cores vivas"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />

                {/* Soft gradient bottom layer to enhance bottom pill legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/15 pointer-events-none" />

                {/* Top Left: Verified Walker Badge */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-white/70 flex items-center gap-1.5 text-[11px] font-bold text-[#111827]">
                  <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>Passeadores Verificados</span>
                </div>

                {/* Top Right: Insurance Badge */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-white/70 flex items-center gap-1.5 text-[11px] font-bold text-[#047857]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#047857]" />
                  <span>Seguro veterinário incluso</span>
                </div>

                {/* Centered Floating Status Pill: Live Walk */}
                <div
                  onClick={onOpenDogQuestionnaire}
                  className={`absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 w-[90%] sm:w-auto sm:min-w-[330px] max-w-sm bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-white/80 flex items-center gap-3 transition-all ${
                    onOpenDogQuestionnaire ? 'cursor-pointer hover:scale-[1.02] hover:shadow-2xl' : ''
                  }`}
                  title="Clique para abrir o Questionário do Cão e ficha"
                >
                  <div className="w-10 h-10 rounded-full bg-[#ECFDF5] text-[#047857] flex items-center justify-center shrink-0 shadow-xs">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
                      <span>Passeio em andamento</span>
                      <span className="w-2 h-2 rounded-full bg-[#047857] animate-pulse" />
                    </p>
                    <p className="text-[11px] text-[#4B5563] truncate">
                      {dogName} está no parque com acompanhamento ao vivo
                    </p>
                  </div>
                </div>
              </div>

              {/* Selector dots to switch/preview alternative high-res photos */}
              <div className="flex items-center justify-center gap-2 mt-4">
                {images.map((img, idx) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    title={img.title}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      activeImageIndex === idx
                        ? 'w-7 bg-[#047857]'
                        : 'w-2 bg-stone-300 hover:bg-stone-400'
                    }`}
                    aria-label={`Ver foto ${idx + 1}`}
                  />
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
