import React, { useState, useRef, useEffect } from 'react';
import { Calendar, HeartHandshake, CalendarCheck, Menu, X, Bell, User, ShieldCheck, MapPin, MessageCircle } from 'lucide-react';
import { NotificationsPopover } from './NotificationsPopover';
import { BRAZILIAN_STATES } from '../utils/locations';

interface NavbarProps {
  onOpenBooking: () => void;
  onOpenBecomeWalker: () => void;
  onOpenMyAppointments: () => void;
  onOpenDogQuestionnaire?: () => void;
  onOpenWelcomeChoice?: () => void;
  onOpenPrivacy?: () => void;
  activeBookingsCount: number;
  dogName?: string;
  selectedCountry?: string;
  selectedState?: string;
  onChangeLocation?: (country: string, state: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onOpenBecomeWalker,
  onOpenMyAppointments,
  onOpenDogQuestionnaire,
  onOpenWelcomeChoice,
  onOpenPrivacy,
  activeBookingsCount,
  dogName = 'Thor',
  selectedCountry = 'Brasil',
  selectedState = 'ES',
  onChangeLocation,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Close notifications on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    if (notificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [notificationsOpen]);

  return (
    <header className="sticky top-0 z-40 bg-[#F9FAF7]/95 backdrop-blur-md border-b border-emerald-100/70 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Mundo do Passeio */}
          <div 
            id="nav-logo"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0 mr-4 lg:mr-6"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#047857] text-white flex items-center justify-center shadow-md shadow-[#047857]/20 group-hover:scale-105 transition-transform shrink-0">
              <span className="text-2xl" role="img" aria-label="pata">🐾</span>
            </div>
            <div className="whitespace-nowrap">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-[#111827] flex items-center">
                Mundo do <span className="text-[#047857] font-black italic ml-1">Passeio</span>
              </span>
              <span className="text-[11px] font-semibold text-[#4B5563] block -mt-0.5 tracking-wide">
                Passeadores por Estado & WhatsApp
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-4 2xl:gap-6 text-sm font-medium text-[#4B5563]">
            <button
              id="nav-link-inicio"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-[#047857] transition-colors cursor-pointer py-1 font-semibold"
            >
              Início
            </button>
            <button
              id="nav-link-como-funciona"
              onClick={() => scrollToSection('como-funciona')}
              className="hover:text-[#047857] transition-colors cursor-pointer py-1"
            >
              Como funciona
            </button>
            <button
              id="nav-link-precos"
              onClick={() => scrollToSection('precos')}
              className="hover:text-[#047857] transition-colors cursor-pointer py-1"
            >
              Preços
            </button>
            <button
              id="nav-link-passeadores"
              onClick={() => scrollToSection('passeadores')}
              className="hover:text-[#047857] transition-colors cursor-pointer py-1"
            >
              Passeadores
            </button>
            {onOpenWelcomeChoice && (
              <button
                id="nav-link-welcome-choice"
                onClick={onOpenWelcomeChoice}
                className="hover:text-[#047857] transition-colors cursor-pointer py-1 flex items-center gap-1 font-semibold text-stone-700 bg-stone-100/80 hover:bg-stone-200/80 px-2.5 py-1 rounded-full border border-stone-200 text-xs whitespace-nowrap"
                title="Escolher entre Cadastrar Pet ou Ser Passeador"
              >
                <span>✨</span>
                <span>Como Começar</span>
              </button>
            )}
            {onOpenDogQuestionnaire && (
              <button
                id="nav-link-questionario-pet"
                onClick={onOpenDogQuestionnaire}
                className="hover:text-[#047857] transition-colors cursor-pointer py-1 flex items-center gap-1 font-medium text-emerald-800 bg-[#ECFDF5] px-2.5 py-1 rounded-full border border-[#D1FAE5] whitespace-nowrap"
                title="Preencher questionário completo do cão"
              >
                <span>🐶</span>
                <span className="font-semibold text-xs text-[#047857]">Questionário do Pet</span>
              </button>
            )}
            {onOpenPrivacy && (
              <button
                id="nav-link-privacidade-lgpd"
                onClick={onOpenPrivacy}
                className="hover:text-[#047857] transition-colors cursor-pointer py-1 flex items-center gap-1 font-medium text-stone-700 bg-stone-100 hover:bg-stone-200/80 px-2.5 py-1 rounded-full border border-stone-200 text-xs whitespace-nowrap"
                title="Central de Privacidade & Direitos do Titular (Art. 18 LGPD)"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#047857]" />
                <span>Privacidade & LGPD</span>
              </button>
            )}
            <button
              id="nav-link-seja-passeador"
              onClick={onOpenBecomeWalker}
              className="text-[#D97706] hover:text-[#B45309] font-bold transition-colors cursor-pointer flex items-center gap-1 py-1 whitespace-nowrap"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Seja passeador</span>
            </button>
          </nav>

          {/* Persistent Header Right: Notifications Bell, User Profile & CTA */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Location Selector Pill */}
            {onChangeLocation && (
              <div className="hidden xl:flex items-center gap-1.5 bg-emerald-50/90 border border-emerald-200 px-3 py-1.5 rounded-full text-xs text-[#047857] font-bold">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>{selectedCountry}</span>
                <span>•</span>
                <select
                  value={selectedState}
                  onChange={(e) => onChangeLocation(selectedCountry, e.target.value)}
                  className="bg-transparent font-black text-[#047857] outline-none cursor-pointer"
                  title="Alterar estado para ver passeadores"
                >
                  {BRAZILIAN_STATES.map((st) => (
                    <option key={st.code} value={st.code} className="text-stone-900">
                      {st.code} - {st.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Direct WhatsApp Contact button */}
            <a
              href="https://wa.me/5527996666164"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#128C7E] text-xs font-bold transition-all shadow-2xs"
              title="Falar no WhatsApp oficial: +55 (27) 99666-6164"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              <span>(27) 99666-6164</span>
            </a>

            {/* Sino de Notificações */}
            <div className="relative" ref={notificationsRef}>
              <button
                id="nav-btn-notificacoes"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2.5 rounded-full bg-white hover:bg-[#ECFDF5] border border-emerald-100/80 text-[#111827] relative transition-colors cursor-pointer shadow-xs"
                title="Notificações em tempo real"
                aria-label="Ver notificações"
              >
                <Bell className="w-5 h-5 text-[#047857]" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#F59E0B] rounded-full ring-2 ring-white animate-pulse" />
              </button>

              <NotificationsPopover
                isOpen={notificationsOpen}
                onClose={() => setNotificationsOpen(false)}
                onViewAppointments={onOpenMyAppointments}
              />
            </div>

            {/* Avatar do Usuário Logado */}
            <button
              id="nav-user-profile-btn"
              onClick={onOpenMyAppointments}
              className="flex items-center gap-2 p-1.5 sm:pr-3 rounded-full bg-white hover:bg-[#ECFDF5] border border-emerald-100/80 transition-all cursor-pointer shadow-xs group"
              title="Meu Perfil e Agendamentos"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-[#ECFDF5] text-[#047857] font-bold text-xs flex items-center justify-center border border-[#D1FAE5]">
                  CA
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#047857] ring-2 ring-white" />
              </div>
              <div className="hidden lg:block text-left">
                <span className="text-xs font-bold text-[#111827] block leading-none">
                  Carlos A.
                </span>
                <span className="text-[10px] text-[#4B5563] block font-medium">
                  Tutor do Thor
                </span>
              </div>
              {activeBookingsCount > 0 && (
                <span className="hidden sm:flex ml-1 px-1.5 py-0.5 rounded-full bg-[#F59E0B] text-white text-[10px] font-bold">
                  {activeBookingsCount}
                </span>
              )}
            </button>

            {/* CTA Desktop */}
            <div className="hidden sm:block">
              <button
                id="nav-btn-agendar-header"
                onClick={onOpenBooking}
                className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-[#047857] hover:bg-[#065F46] shadow-md shadow-[#047857]/20 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Agendar passeio</span>
              </button>
            </div>

            {/* Mobile hamburger */}
            <div className="md:hidden flex items-center">
              <button
                id="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-2xl bg-white border border-stone-200 text-[#111827] hover:bg-stone-50 transition-colors cursor-pointer"
                aria-label="Menu de navegação"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-emerald-100/70 space-y-2 bg-[#F9FAF7] pb-6 animate-fadeIn">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl text-[#111827] hover:bg-white font-semibold flex items-center justify-between"
            >
              <span>Início</span>
            </button>
            <button
              onClick={() => scrollToSection('como-funciona')}
              className="w-full text-left px-3 py-2.5 rounded-xl text-[#4B5563] hover:bg-white font-medium"
            >
              Como funciona
            </button>
            <button
              onClick={() => scrollToSection('precos')}
              className="w-full text-left px-3 py-2.5 rounded-xl text-[#4B5563] hover:bg-white font-medium"
            >
              Preços & Adicionais
            </button>
            <button
              onClick={() => scrollToSection('passeadores')}
              className="w-full text-left px-3 py-2.5 rounded-xl text-[#4B5563] hover:bg-white font-medium"
            >
              Passeadores Disponíveis
            </button>
            {onOpenWelcomeChoice && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenWelcomeChoice();
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl text-stone-800 hover:bg-stone-100 font-bold flex items-center gap-2"
              >
                <span>✨</span>
                <span>Como Começar (Tutor ou Passeador)</span>
              </button>
            )}
            {onOpenDogQuestionnaire && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDogQuestionnaire();
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl text-[#047857] hover:bg-[#ECFDF5] font-bold flex items-center gap-2"
              >
                <span>🐶</span>
                <span>Questionário do Cachorro ({dogName})</span>
              </button>
            )}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBecomeWalker();
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl text-[#D97706] hover:bg-amber-50 font-bold flex items-center gap-2"
            >
              <HeartHandshake className="w-4 h-4" />
              Seja um passeador parceiro
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenMyAppointments();
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl text-[#047857] hover:bg-[#ECFDF5] font-bold flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              Perfil do Tutor & Agendamentos ({activeBookingsCount})
            </button>
            {onOpenPrivacy && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPrivacy();
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl text-stone-700 hover:bg-stone-100 font-bold flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-[#047857]" />
                Central de Privacidade & LGPD (Art. 18)
              </button>
            )}

            <div className="pt-2">
              <button
                id="mobile-btn-agendar-cta"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full py-3.5 rounded-full text-center text-sm font-bold text-white bg-[#047857] hover:bg-[#065F46] shadow-md shadow-[#047857]/20 cursor-pointer flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Agendar passeio agora</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
