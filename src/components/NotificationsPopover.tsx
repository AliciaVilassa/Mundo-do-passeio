import React from 'react';
import { Bell, CheckCircle2, MapPin, Camera, ShieldCheck, X, Sparkles } from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  type: 'live' | 'photo' | 'safety' | 'reminder';
}

interface NotificationsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onViewAppointments: () => void;
}

export const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({
  isOpen,
  onClose,
  onViewAppointments,
}) => {
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([
    {
      id: '1',
      title: 'Mariana iniciou o passeio com Thor 🐕',
      description: 'Caminhada iniciada no Parque Ibirapuera. Rastreamento GPS e rota ativa ao vivo.',
      time: 'Há 18 min',
      unread: true,
      type: 'live',
    },
    {
      id: '2',
      title: 'Foto enviada pela passeadora 📸',
      description: 'Thor se divertindo na sombra das árvores e hidratado com água fresca.',
      time: 'Há 1 hora',
      unread: true,
      type: 'photo',
    },
    {
      id: '3',
      title: 'Seguro Veterinário Ativo 🛡️',
      description: 'Cobertura de saúde e emergência PasseioPet garantida para todos os passeios da semana.',
      time: 'Hoje, 08:00',
      unread: false,
      type: 'safety',
    },
  ]);

  if (!isOpen) return null;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-emerald-100/60 p-5 z-50 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#ECFDF5] text-[#047857] flex items-center justify-center">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-[#111827]">Notificações</h3>
            <span className="text-[11px] text-[#4B5563]">Atualizações em tempo real</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={markAllAsRead}
            className="text-[11px] font-semibold text-[#047857] hover:underline cursor-pointer"
          >
            Marcar lidas
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
        {notifications.map((item) => (
          <div
            key={item.id}
            className={`p-3 rounded-2xl border transition-all ${
              item.unread
                ? 'bg-[#F9FAF7] border-emerald-100 hover:border-emerald-300'
                : 'bg-white border-stone-100 hover:bg-stone-50'
            }`}
          >
            <div className="flex items-start gap-2.5">
              <div
                className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs mt-0.5 ${
                  item.type === 'live'
                    ? 'bg-[#ECFDF5] text-[#047857]'
                    : item.type === 'photo'
                    ? 'bg-[#FEF3C7] text-[#D97706]'
                    : 'bg-blue-50 text-blue-700'
                }`}
              >
                {item.type === 'live' && <MapPin className="w-3.5 h-3.5" />}
                {item.type === 'photo' && <Camera className="w-3.5 h-3.5" />}
                {item.type === 'safety' && <ShieldCheck className="w-3.5 h-3.5" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <h4 className="text-xs font-bold text-[#111827] truncate">
                    {item.title}
                  </h4>
                  <span className="text-[10px] text-stone-400 shrink-0 font-medium">
                    {item.time}
                  </span>
                </div>
                <p className="text-[11px] text-[#4B5563] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer link */}
      <div className="pt-3 mt-3 border-t border-stone-100">
        <button
          onClick={() => {
            onClose();
            onViewAppointments();
          }}
          className="w-full py-2 rounded-full text-xs font-bold text-[#047857] bg-[#ECFDF5] hover:bg-emerald-100 transition-colors text-center cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span>Ver rotina completa do cão</span>
          <Sparkles className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
