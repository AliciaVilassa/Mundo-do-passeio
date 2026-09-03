import React from 'react';
import { Dog, Calendar, UserCheck, Heart, ShieldCheck, Clock, Sparkles } from 'lucide-react';

interface HowItWorksProps {
  onStartBooking: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onStartBooking }) => {
  const steps = [
    {
      number: '01',
      title: 'Cadastre seu cachorro',
      description: 'Conte para nós tudo sobre a rotina, porte, personalidade e cuidados veterinários dele.',
      icon: Dog,
      tag: 'Perfil personalizado',
      color: 'bg-[#ECFDF5] text-[#047857] border-[#D1FAE5]',
      iconBg: 'bg-[#047857] text-white',
    },
    {
      number: '02',
      title: 'Escolha os passeios',
      description: 'Escolha quantos passeios quer por dia e em quais dias da semana funcionam para você.',
      icon: Calendar,
      tag: 'Rotina flexível',
      color: 'bg-[#FEF3C7] text-[#D97706] border-amber-200',
      iconBg: 'bg-[#F59E0B] text-white',
    },
    {
      number: '03',
      title: 'Escolha seu passeador',
      description: 'Veja os passeadores certificados disponíveis na sua região e selecione o seu favorito.',
      icon: UserCheck,
      tag: 'Passeadores verificados',
      color: 'bg-[#ECFDF5] text-[#047857] border-[#D1FAE5]',
      iconBg: 'bg-[#065F46] text-white',
    },
    {
      number: '04',
      title: 'Seu cão vai passear!',
      description: 'O passeador busca seu cachorro em casa com seguro incluso, rota por GPS e fotos ao vivo.',
      icon: Sparkles,
      tag: 'Alegria & Segurança',
      color: 'bg-orange-50 text-orange-800 border-orange-200',
      iconBg: 'bg-orange-500 text-white',
    },
  ];

  return (
    <section id="como-funciona" className="py-16 md:py-24 bg-white border-y border-emerald-100/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ECFDF5] text-[#047857] border border-[#D1FAE5] text-xs font-bold tracking-wide uppercase">
            <span>🐕 Simples, rápido e confiável</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
            Como funciona
          </h2>
          <p className="text-base sm:text-lg text-[#4B5563]">
            Tudo pensado para o bem-estar do seu melhor amigo e a sua total tranquilidade.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                id={`step-card-${step.number}`}
                className="group relative bg-[#F9FAF7] rounded-3xl p-6 sm:p-7 border border-emerald-100/70 hover:border-emerald-300 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-xl hover:shadow-[#047857]/5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top indicator & step number */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-2xl ${step.iconBg} flex items-center justify-center shadow-md shadow-emerald-950/10 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 stroke-[2.2px]" />
                    </div>
                    <span className="text-3xl font-black text-stone-300 group-hover:text-[#047857]/40 transition-colors">
                      {step.number}
                    </span>
                  </div>

                  <span className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full border mb-3 ${step.color}`}>
                    {step.tag}
                  </span>

                  <h3 className="text-xl font-bold text-[#111827] mb-2 leading-snug">
                    {step.title}
                  </h3>

                  <p className="text-sm text-[#4B5563] leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-stone-200/60 flex items-center gap-1 text-xs font-bold text-[#047857]">
                  <span>PasseioPet Cuida</span>
                  <span>🐾</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA for Section */}
        <div className="mt-14 text-center">
          <button
            onClick={onStartBooking}
            className="px-8 py-4 rounded-full text-sm sm:text-base font-bold text-white bg-[#047857] hover:bg-[#065F46] shadow-md shadow-[#047857]/20 transition-all cursor-pointer inline-flex items-center gap-2.5 active:scale-95"
          >
            <span>Iniciar agendamento da rotina</span>
            <span>🐾</span>
          </button>
        </div>

      </div>
    </section>
  );
};
