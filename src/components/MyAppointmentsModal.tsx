import React from 'react';
import { BookingRecord } from '../types';
import { X, Calendar, Clock, MapPin, User, CheckCircle2, AlertCircle, Phone, Trash2 } from 'lucide-react';
import { SHORT_DAYS } from '../data/walkers';

interface MyAppointmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: BookingRecord[];
  onCancelBooking: (id: string) => void;
  onNewBookingClick: () => void;
}

export const MyAppointmentsModal: React.FC<MyAppointmentsModalProps> = ({
  isOpen,
  onClose,
  bookings,
  onCancelBooking,
  onNewBookingClick,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 relative p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          id="close-appointments-modal"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="pb-4 border-b border-stone-100 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Área do Tutor</span>
          </div>
          <h2 className="text-2xl font-black text-stone-900">
            Meus Agendamentos
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Acompanhe a rotina dos seus cães, contatos do passeador e relatórios
          </p>
        </div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <div className="text-center py-12 space-y-4 bg-[#FAF8F5] rounded-3xl border border-dashed border-stone-300 p-8">
            <div className="text-4xl">🐕</div>
            <h3 className="text-lg font-bold text-stone-800">
              Nenhum agendamento ativo no momento
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
              Seu melhor amigo está esperando por um passeio incrível! Configure a rotina e escolha um passeador agora mesmo.
            </p>
            <button
              onClick={() => {
                onClose();
                onNewBookingClick();
              }}
              className="px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Agendar primeiro passeio</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                id={`booking-card-${booking.id}`}
                className="p-5 rounded-3xl border border-stone-200 bg-[#FAF8F5] hover:border-emerald-300 transition-all space-y-4"
              >
                {/* Header: Dog info & status badge */}
                <div className="flex items-center justify-between pb-3 border-b border-stone-200/60">
                  <div className="flex items-center gap-3">
                    <img
                      src={booking.dog.photoUrl}
                      alt={booking.dog.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-stone-200"
                    />
                    <div>
                      <h4 className="font-extrabold text-stone-900 text-base">
                        🐶 {booking.dog.name}
                      </h4>
                      <p className="text-xs text-stone-500">
                        {booking.dog.breed} · Porte {booking.dog.size} · {booking.dog.age} anos
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {booking.status}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-2xl border border-stone-100 space-y-1">
                    <span className="text-stone-400 font-semibold block">Passeador(a) Designado(a):</span>
                    <span className="font-bold text-stone-800 text-sm flex items-center gap-1.5">
                      🐾 {booking.walker.name}
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Região: {booking.walker.coverageArea.split(',')[0]}
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-2xl border border-stone-100 space-y-1">
                    <span className="text-stone-400 font-semibold block">Frequência e Horários:</span>
                    <span className="font-bold text-stone-800">
                      {booking.schedule.walksPerDay}x ao dia · {booking.schedule.selectedDays.map((d) => SHORT_DAYS[d]).join(', ')}
                    </span>
                    <span className="text-[11px] text-emerald-800 font-semibold block">
                      Horários: {booking.schedule.walkTimes.join(', ')}
                    </span>
                  </div>
                </div>

                {/* Address & Emergency info */}
                <div className="text-xs text-stone-600 bg-white p-3 rounded-2xl border border-stone-100 space-y-1">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                    <span><strong>Endereço de busca:</strong> {booking.dog.pickupAddress}</span>
                  </div>
                  {booking.dog.referencePoint && (
                    <div className="text-[11px] text-stone-400 pl-5">
                      Ponto de ref.: {booking.dog.referencePoint}
                    </div>
                  )}
                </div>

                {/* Pricing & Footer Actions */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-stone-200/70">
                  <div>
                    <span className="text-[10px] text-stone-400 font-bold uppercase block">
                      Valor semanal cobrado:
                    </span>
                    <span className="text-xl font-black text-emerald-800">
                      R$ {booking.totalPriceWeekly}
                    </span>
                    <span className="text-xs text-stone-500"> ({booking.totalWalksWeekly} passeios/semana)</span>
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
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Falar no WhatsApp</span>
                    </a>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        <div className="pt-6 mt-6 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full text-sm font-bold bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
