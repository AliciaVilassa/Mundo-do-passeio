import React from 'react';
import { Home, Calendar, Compass, HeartHandshake, User } from 'lucide-react';

export type MobileTab = 'inicio' | 'agendar' | 'passeadores' | 'trabalhe' | 'perfil';

interface BottomNavBarProps {
  activeTab: MobileTab;
  onTabSelect: (tab: MobileTab) => void;
  activeBookingsCount?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onTabSelect,
  activeBookingsCount = 0,
}) => {
  return (
    <nav
      id="bottom-navigation-bar"
      aria-label="Navegação móvel principal"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-emerald-100/70 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 md:hidden transition-all"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 gap-1 items-center">
        
        {/* 1. Início */}
        <button
          id="bottom-nav-inicio"
          onClick={() => onTabSelect('inicio')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'inicio'
              ? 'text-[#047857] font-bold bg-[#ECFDF5]'
              : 'text-[#4B5563] hover:text-[#111827]'
          }`}
        >
          <Home className={`w-5 h-5 mb-0.5 ${activeTab === 'inicio' ? 'stroke-[2.5px]' : ''}`} />
          <span className="text-[10px] tracking-tight whitespace-nowrap">Início</span>
        </button>

        {/* 2. Agendar */}
        <button
          id="bottom-nav-agendar"
          onClick={() => onTabSelect('agendar')}
          className="flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all cursor-pointer text-[#047857] group"
        >
          <div className="w-9 h-9 rounded-full bg-[#047857] group-hover:bg-[#065F46] text-white flex items-center justify-center shadow-md shadow-[#047857]/30 transition-transform active:scale-95">
            <Calendar className="w-5 h-5 stroke-[2.2px]" />
          </div>
          <span className="text-[10px] font-bold text-[#047857] mt-0.5 whitespace-nowrap">Agendar</span>
        </button>

        {/* 3. Passeadores */}
        <button
          id="bottom-nav-passeadores"
          onClick={() => onTabSelect('passeadores')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'passeadores'
              ? 'text-[#047857] font-bold bg-[#ECFDF5]'
              : 'text-[#4B5563] hover:text-[#111827]'
          }`}
        >
          <Compass className={`w-5 h-5 mb-0.5 ${activeTab === 'passeadores' ? 'stroke-[2.5px]' : ''}`} />
          <span className="text-[10px] tracking-tight whitespace-nowrap">Passeadores</span>
        </button>

        {/* 4. Trabalhe */}
        <button
          id="bottom-nav-trabalhe"
          onClick={() => onTabSelect('trabalhe')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'trabalhe'
              ? 'text-[#D97706] font-bold bg-[#FEF3C7]'
              : 'text-[#4B5563] hover:text-[#111827]'
          }`}
        >
          <HeartHandshake className={`w-5 h-5 mb-0.5 ${activeTab === 'trabalhe' ? 'stroke-[2.5px] text-[#D97706]' : ''}`} />
          <span className="text-[10px] tracking-tight whitespace-nowrap">Trabalhe</span>
        </button>

        {/* 5. Perfil */}
        <button
          id="bottom-nav-perfil"
          onClick={() => onTabSelect('perfil')}
          className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'perfil'
              ? 'text-[#047857] font-bold bg-[#ECFDF5]'
              : 'text-[#4B5563] hover:text-[#111827]'
          }`}
        >
          <div className="relative">
            <User className={`w-5 h-5 mb-0.5 ${activeTab === 'perfil' ? 'stroke-[2.5px]' : ''}`} />
            {activeBookingsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#F59E0B] ring-2 ring-white" />
            )}
          </div>
          <span className="text-[10px] tracking-tight whitespace-nowrap">Perfil</span>
        </button>

      </div>
    </nav>
  );
};
