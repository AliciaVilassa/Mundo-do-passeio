import React from 'react';
import { DogProfile, ScheduleOptions } from '../types';
import { calculateWeeklyPrice, SHORT_DAYS } from '../data/walkers';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface BookingSummaryCardProps {
  dog: DogProfile;
  schedule: ScheduleOptions;
  currentStep: number;
  totalSteps: number;
  onNext?: () => void;
  isNextDisabled?: boolean;
  nextButtonLabel?: string;
}

export const BookingSummaryCard: React.FC<BookingSummaryCardProps> = ({
  dog,
  schedule,
  currentStep,
  totalSteps,
  onNext,
  isNextDisabled = false,
  nextButtonLabel = 'Continuar',
}) => {
  const calculation = calculateWeeklyPrice(
    schedule.walksPerDay,
    schedule.selectedDays,
    schedule.additionals
  );

  // Formatted day names
  const formattedDays =
    schedule.selectedDays.length === 7
      ? 'Todos os dias da semana'
      : schedule.selectedDays.length === 0
      ? 'Nenhum dia selecionado'
      : schedule.selectedDays.map((d) => SHORT_DAYS[d] || d).join(', ');

  return (
    <div className="bg-white rounded-3xl p-6 border border-emerald-100/70 shadow-[0_4px_20px_rgba(0,0,0,0.03)] sticky top-24 space-y-5">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <h3 className="text-lg font-black text-[#111827] flex items-center gap-2">
          <span>Resumo do pedido</span>
        </h3>
        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#047857] border border-[#D1FAE5]">
          Etapa {currentStep} de {totalSteps}
        </span>
      </div>

      {/* Overview Items matching user prompt format */}
      <div className="space-y-3 text-sm">
        {/* Cachorro */}
        <div className="flex items-center justify-between">
          <span className="text-[#4B5563] flex items-center gap-1.5 font-medium">
            <span>🐶</span> Cachorro:
          </span>
          <span className="font-extrabold text-[#111827]">
            {dog.name.trim() || 'A definir'}
          </span>
        </div>

        {/* Passeios por dia */}
        <div className="flex items-center justify-between">
          <span className="text-[#4B5563] flex items-center gap-1.5 font-medium">
            <span>🚶</span> Passeios por dia:
          </span>
          <span className="font-extrabold text-[#111827]">
            {schedule.walksPerDay} {schedule.walksPerDay === 1 ? 'passeio' : 'passeios'}
          </span>
        </div>

        {/* Dias da semana */}
        <div className="flex items-start justify-between gap-2">
          <span className="text-[#4B5563] flex items-center gap-1.5 font-medium shrink-0">
            <span>📅</span> Dias:
          </span>
          <span className="font-semibold text-[#111827] text-right text-xs">
            {formattedDays}
          </span>
        </div>
      </div>

      {/* Math formula */}
      <div className="p-3.5 rounded-2xl bg-[#F9FAF7] border border-emerald-100/70 space-y-2 text-xs">
        <div className="font-bold text-[#111827] text-center pb-2 border-b border-stone-200/60">
          {calculation.totalDays} dias × {schedule.walksPerDay} {schedule.walksPerDay === 1 ? 'passeio' : 'passeios'} ={' '}
          <span className="text-[#047857]">{calculation.totalWalks} passeios/semana</span>
        </div>

        <div className="flex justify-between text-[#4B5563]">
          <span>Valor base ({calculation.totalWalks} × R$ 25):</span>
          <span className="font-bold text-[#111827]">R$ {calculation.baseTotal}</span>
        </div>

        <div className="flex justify-between text-[#4B5563]">
          <span>Adicionais selecionados:</span>
          <span className="font-bold text-[#047857]">
            {calculation.additionalsTotal > 0 ? `+ R$ ${calculation.additionalsTotal}` : 'R$ 0'}
          </span>
        </div>
      </div>

      {/* Grand Total */}
      <div className="pt-2 border-t border-stone-100 flex items-baseline justify-between">
        <div>
          <span className="text-xs font-bold text-[#4B5563] uppercase tracking-wider block">
            Total Semanal
          </span>
          <div className="text-3xl font-black text-[#047857] tracking-tight">
            R$ {calculation.grandTotal}
            <span className="text-xs font-bold text-[#4B5563] tracking-normal"> /semana</span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-[#4B5563] block">
            Cobrança semanal
          </span>
          <span className="text-[11px] text-[#047857] font-semibold flex items-center gap-1 justify-end">
            <CheckCircle2 className="w-3 h-3" /> Cancele quando quiser
          </span>
        </div>
      </div>

      {/* Continue Action Button */}
      {onNext && (
        <button
          id="summary-btn-continue"
          onClick={onNext}
          disabled={isNextDisabled}
          className={`w-full py-4 rounded-full text-base font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
            isNextDisabled
              ? 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
              : 'bg-[#047857] hover:bg-[#065F46] active:scale-[0.99] text-white shadow-[#047857]/20'
          }`}
        >
          <span>{nextButtonLabel}</span>
          <ArrowRight className="w-4 h-4" />
          <span>🐾</span>
        </button>
      )}
    </div>
  );
};
