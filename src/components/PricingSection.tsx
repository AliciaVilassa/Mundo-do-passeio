import React, { useState } from 'react';
import { PRICING_CONSTANTS, calculateWeeklyPrice, SHORT_DAYS, DAYS_OF_WEEK } from '../data/walkers';
import { Check, Plus, Calculator, ArrowRight, ShieldCheck, Sparkles, HelpCircle } from 'lucide-react';

interface PricingSectionProps {
  onConfigureSchedule: (params: {
    walksPerDay: number;
    selectedDays: string[];
    additionals: {
      secondDog: boolean;
      largeDog: boolean;
      soloWalk: boolean;
      sundayHoliday: boolean;
    };
  }) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onConfigureSchedule }) => {
  // Simulator state
  const [simWalksPerDay, setSimWalksPerDay] = useState<number>(2);
  const [simDays, setSimDays] = useState<string[]>([
    'Segunda-feira',
    'Quarta-feira',
    'Sexta-feira',
  ]);
  const [simAdditionals, setSimAdditionals] = useState({
    secondDog: false,
    largeDog: false,
    soloWalk: false,
    sundayHoliday: false,
  });

  const toggleDay = (day: string) => {
    if (simDays.includes(day)) {
      if (simDays.length > 1) {
        setSimDays(simDays.filter((d) => d !== day));
      }
    } else {
      setSimDays([...simDays, day]);
    }
  };

  const toggleAdditional = (key: keyof typeof simAdditionals) => {
    setSimAdditionals((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const calculated = calculateWeeklyPrice(simWalksPerDay, simDays, simAdditionals);

  const handleStartWithSimulator = () => {
    onConfigureSchedule({
      walksPerDay: simWalksPerDay,
      selectedDays: simDays,
      additionals: simAdditionals,
    });
  };

  return (
    <section id="precos" className="py-16 md:py-24 bg-[#F9FAF7] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF3C7] text-[#D97706] border border-amber-200/80 text-xs font-bold uppercase tracking-wider">
            <span>💰 Transparência Total</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
            Preço justo e sem surpresas
          </h2>
          <p className="text-base sm:text-lg text-[#4B5563] font-medium">
            Aqui o valor é cobrado estritamente <strong className="text-[#111827] underline decoration-[#F59E0B] decoration-2">por passeio realizado</strong>, sem planos engessados ou mensalidades fixas abusivas.
          </p>
        </div>

        {/* Pricing Layout: Base Price + Adicionais Table + Live Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          
          {/* Left Column: Official Pricing & Additions Table */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Primary Base Walk Card */}
            <div className="bg-white rounded-3xl p-7 sm:p-8 border border-emerald-100/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#047857] text-white text-[11px] font-bold uppercase px-4 py-1.5 rounded-bl-2xl tracking-wider">
                Valor Base
              </div>
              
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl sm:text-5xl font-black text-[#111827]">
                  R$ 25
                </span>
                <span className="text-lg font-bold text-[#047857]">
                  / passeio
                </span>
              </div>
              
              <p className="text-sm text-[#4B5563] mb-6 leading-relaxed">
                Passeio completo de 40 a 50 minutos com hidratação, enriquecimento olfativo, higienização das patinhas e acompanhamento via GPS.
              </p>

              <div className="space-y-2.5 pt-4 border-t border-stone-100">
                <div className="flex items-center gap-2.5 text-sm font-medium text-[#111827]">
                  <div className="w-5 h-5 rounded-full bg-[#ECFDF5] text-[#047857] flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>Passeadores treinados e avaliados com carinho pela comunidade</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm font-medium text-[#111827]">
                  <div className="w-5 h-5 rounded-full bg-[#ECFDF5] text-[#047857] flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>Relatório pós-passeio com fotos e resumo do percurso</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm font-medium text-[#111827]">
                  <div className="w-5 h-5 rounded-full bg-[#ECFDF5] text-[#047857] flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>Seguro de saúde veterinária emergencial incluso</span>
                </div>
              </div>
            </div>

            {/* Adicionais Card Table */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-100/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div>
                  <h3 className="text-lg font-bold text-[#111827]">
                    Tabela de Adicionais
                  </h3>
                  <p className="text-xs text-[#4B5563]">
                    Opcionais configurados de acordo com as necessidades do seu cão
                  </p>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-[#FEF3C7] text-[#D97706] rounded-full border border-amber-200/80">
                  Por passeio
                </span>
              </div>

              <div className="divide-y divide-stone-100">
                <div className="py-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-sm font-semibold text-[#111827] block">
                      Segundo cachorro
                    </span>
                    <span className="text-xs text-[#4B5563]">
                      Mesma casa / mesmo tutor
                    </span>
                  </div>
                  <span className="text-sm font-bold text-[#047857] bg-[#ECFDF5] px-3 py-1 rounded-full border border-[#D1FAE5]">
                    + R$ 15 <span className="text-xs font-normal">/ passeio</span>
                  </span>
                </div>

                <div className="py-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-sm font-semibold text-[#111827] block">
                      Cachorro de grande porte
                    </span>
                    <span className="text-xs text-[#4B5563]">
                      Requer manejo e força física especializada
                    </span>
                  </div>
                  <span className="text-sm font-bold text-[#047857] bg-[#ECFDF5] px-3 py-1 rounded-full border border-[#D1FAE5]">
                    + R$ 10 <span className="text-xs font-normal">/ passeio</span>
                  </span>
                </div>

                <div className="py-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-sm font-semibold text-[#111827] block">
                      Passeio individual
                    </span>
                    <span className="text-xs text-[#4B5563]">
                      Atenção 100% exclusiva para cães tímidos ou reativos
                    </span>
                  </div>
                  <span className="text-sm font-bold text-[#047857] bg-[#ECFDF5] px-3 py-1 rounded-full border border-[#D1FAE5]">
                    + R$ 15 <span className="text-xs font-normal">/ passeio</span>
                  </span>
                </div>

                <div className="py-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-sm font-semibold text-[#111827] block">
                      Domingo/feriado
                    </span>
                    <span className="text-xs text-[#4B5563]">
                      Adicional para dias especiais e finais de semana
                    </span>
                  </div>
                  <span className="text-sm font-bold text-[#047857] bg-[#ECFDF5] px-3 py-1 rounded-full border border-[#D1FAE5]">
                    + R$ 10 <span className="text-xs font-normal">/ passeio</span>
                  </span>
                </div>
              </div>

              {/* Exact user requested observation */}
              <div className="mt-4 p-4 rounded-2xl bg-[#FEF3C7]/60 border border-amber-200/80 text-xs sm:text-sm text-[#111827] font-semibold leading-relaxed">
                <blockquote>
                  "O valor final depende da quantidade de passeios escolhidos, dos dias da semana e dos adicionais selecionados."
                </blockquote>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Simulator */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-6">
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#ECFDF5] text-[#047857] flex items-center justify-center">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#111827]">
                    Simulador Interativo
                  </h3>
                  <p className="text-xs text-[#4B5563]">
                    Veja em tempo real o cálculo exato para a sua rotina semanal
                  </p>
                </div>
              </div>

              {/* 1. Passeios por dia - Chips com Fundo cinza inativo e Verde Escuro ativo com check */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4B5563] block">
                  Quantos passeios por dia?
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[1, 2, 3].map((num) => {
                    const isSelected = simWalksPerDay === num;
                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setSimWalksPerDay(num)}
                        className={`py-3 px-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer border flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#047857] text-white border-[#047857] shadow-sm shadow-[#047857]/20'
                            : 'bg-stone-100 hover:bg-stone-200/70 text-[#4B5563] border-stone-200'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        <span>{num} {num === 1 ? 'passeio' : 'passeios'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Dias da semana - Chips com Fundo cinza inativo e Verde Escuro ativo com check */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#4B5563]">
                    Quais dias da semana?
                  </label>
                  <span className="text-[#047857] font-bold text-xs lowercase">
                    {simDays.length} {simDays.length === 1 ? 'dia' : 'dias'}
                  </span>
                </div>
                <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                  {DAYS_OF_WEEK.map((day) => {
                    const isSelected = simDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        title={day}
                        className={`h-11 rounded-2xl text-xs font-bold flex flex-col items-center justify-center transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-[#047857] text-white border-[#047857] shadow-xs'
                            : 'bg-stone-100 hover:bg-stone-200/70 text-[#4B5563] border-stone-200'
                        }`}
                      >
                        <span>{SHORT_DAYS[day]}</span>
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3] mt-0.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Adicionais Chips / Checkboxes */}
              <div className="space-y-2.5 pt-2 border-t border-stone-100">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4B5563] block">
                  Deseja algum adicional?
                </label>
                
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => toggleAdditional('secondDog')}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer text-left ${
                      simAdditionals.secondDog
                        ? 'bg-[#ECFDF5] border-[#047857] text-[#047857]'
                        : 'bg-stone-50 hover:bg-stone-100/80 border-stone-200 text-[#111827]'
                    }`}
                  >
                    <span className="flex items-center gap-2.5 text-sm font-semibold">
                      <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                        simAdditionals.secondDog ? 'bg-[#047857] border-[#047857] text-white' : 'bg-white border-stone-300'
                      }`}>
                        {simAdditionals.secondDog && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      Segundo cachorro
                    </span>
                    <span className="text-xs font-bold text-[#4B5563]">+ R$ 15/passeio</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleAdditional('largeDog')}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer text-left ${
                      simAdditionals.largeDog
                        ? 'bg-[#ECFDF5] border-[#047857] text-[#047857]'
                        : 'bg-stone-50 hover:bg-stone-100/80 border-stone-200 text-[#111827]'
                    }`}
                  >
                    <span className="flex items-center gap-2.5 text-sm font-semibold">
                      <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                        simAdditionals.largeDog ? 'bg-[#047857] border-[#047857] text-white' : 'bg-white border-stone-300'
                      }`}>
                        {simAdditionals.largeDog && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      Cachorro de grande porte
                    </span>
                    <span className="text-xs font-bold text-[#4B5563]">+ R$ 10/passeio</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleAdditional('soloWalk')}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer text-left ${
                      simAdditionals.soloWalk
                        ? 'bg-[#ECFDF5] border-[#047857] text-[#047857]'
                        : 'bg-stone-50 hover:bg-stone-100/80 border-stone-200 text-[#111827]'
                    }`}
                  >
                    <span className="flex items-center gap-2.5 text-sm font-semibold">
                      <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                        simAdditionals.soloWalk ? 'bg-[#047857] border-[#047857] text-white' : 'bg-white border-stone-300'
                      }`}>
                        {simAdditionals.soloWalk && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      Passeio individual (sem outros cães)
                    </span>
                    <span className="text-xs font-bold text-[#4B5563]">+ R$ 15/passeio</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleAdditional('sundayHoliday')}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer text-left ${
                      simAdditionals.sundayHoliday
                        ? 'bg-[#ECFDF5] border-[#047857] text-[#047857]'
                        : 'bg-stone-50 hover:bg-stone-100/80 border-stone-200 text-[#111827]'
                    }`}
                  >
                    <span className="flex items-center gap-2.5 text-sm font-semibold">
                      <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                        simAdditionals.sundayHoliday ? 'bg-[#047857] border-[#047857] text-white' : 'bg-white border-stone-300'
                      }`}>
                        {simAdditionals.sundayHoliday && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      Domingo / feriado
                    </span>
                    <span className="text-xs font-bold text-[#4B5563]">+ R$ 10/passeio</span>
                  </button>
                </div>
              </div>

              {/* Simulation Calculation Result Box */}
              <div className="p-5 rounded-3xl bg-[#ECFDF5] border border-[#D1FAE5] space-y-3">
                <div className="flex items-center justify-between text-xs text-[#4B5563] pb-2 border-b border-emerald-200/60 font-medium">
                  <span>Fórmula semanal:</span>
                  <span className="font-bold text-[#111827]">
                    {calculated.totalDays} dias × {simWalksPerDay} passeios = {calculated.totalWalks} passeios/sem
                  </span>
                </div>

                <div className="flex justify-between text-xs text-[#4B5563]">
                  <span>Valor base ({calculated.totalWalks} × R$ 25):</span>
                  <span className="font-semibold text-[#111827]">R$ {calculated.baseTotal}</span>
                </div>

                {calculated.additionalPerWalk > 0 && (
                  <div className="flex justify-between text-xs text-[#D97706] font-medium">
                    <span>Adicionais ({calculated.totalWalks} × R$ {calculated.additionalPerWalk}):</span>
                    <span>+ R$ {calculated.additionalsTotal}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-emerald-200/80 flex items-baseline justify-between">
                  <span className="text-sm font-bold text-[#111827]">Total Semanal Estimado:</span>
                  <div className="text-right">
                    <span className="text-2xl sm:text-3xl font-black text-[#047857]">
                      R$ {calculated.grandTotal}
                    </span>
                    <span className="text-xs text-[#4B5563] block -mt-1 font-medium">
                      / semana cobrada
                    </span>
                  </div>
                </div>
              </div>

              {/* Simulator CTA Button */}
              <button
                id="simulator-cta-start"
                type="button"
                onClick={handleStartWithSimulator}
                className="w-full py-4 rounded-full text-sm sm:text-base font-bold text-white bg-[#047857] hover:bg-[#065F46] shadow-md shadow-[#047857]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Agendar com esta rotina simulada</span>
                <ArrowRight className="w-4 h-4" />
                <span>🐾</span>
              </button>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
