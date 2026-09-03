import React from 'react';
import { ShieldCheck, Heart, Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react';

interface FooterProps {
  onOpenBooking: () => void;
  onOpenBecomeWalker: () => void;
  onOpenPrivacy?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBooking, onOpenBecomeWalker, onOpenPrivacy }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-stone-950 flex items-center justify-center font-bold text-xl shadow-md">
                🐾
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                Mundo do <span className="text-emerald-400 font-extrabold italic">Passeio</span>
              </span>
            </div>
            
            <p className="text-sm text-stone-400 leading-relaxed max-w-sm">
              Mundo do Passeio: conectando tutores amorosos a passeadores certificados e dedicados por estado. Cuidamos da saúde física e emocional do seu melhor amigo com respeito e segurança.
            </p>

            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3.5 py-2 rounded-2xl w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Garantia de segurança e seguro veterinário emergencial incluso</span>
            </div>
          </div>

          {/* Col 3: Navegação */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-200 uppercase tracking-wider">
              Navegação
            </h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <a href="#hero-section" className="hover:text-white transition-colors">
                  Início
                </a>
              </li>
              <li>
                <a href="#como-funciona" className="hover:text-white transition-colors">
                  Como funciona
                </a>
              </li>
              <li>
                <a href="#precos" className="hover:text-white transition-colors">
                  Preços & Adicionais
                </a>
              </li>
              <li>
                <a href="#passeadores" className="hover:text-white transition-colors">
                  Passeadores disponíveis
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenBecomeWalker}
                  className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                >
                  Seja um passeador
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Dúvidas Comuns & LGPD */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-200 uppercase tracking-wider">
              Segurança & Políticas
            </h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <button
                  type="button"
                  onClick={onOpenPrivacy}
                  className="hover:text-emerald-400 text-stone-300 transition-colors cursor-pointer text-left flex items-center gap-1.5 font-semibold"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Central de Privacidade & LGPD (Art. 18)</span>
                </button>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Como são selecionados os passeadores
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Acompanhamento por GPS ao vivo
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Política de cancelamento flexível
                </span>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenPrivacy}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Termos de serviço & Privacidade
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Atendimento & CTA */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-stone-200 uppercase tracking-wider">
              Atendimento
            </h4>
            <p className="text-xs text-stone-400">
              Dúvidas sobre o agendamento? Nossa equipe responde com carinho.
            </p>
            <div className="space-y-2 text-xs text-stone-300">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <a href="https://wa.me/5527996666164" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">
                  +55 (27) 99666-6164 (WhatsApp)
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <a href="mailto:mundodopasseio@gmail.com" className="hover:text-emerald-400 transition-colors">
                  mundodopasseio@gmail.com
                </a>
              </div>
            </div>

            <button
              onClick={onOpenBooking}
              className="w-full py-2.5 rounded-full text-xs font-bold text-stone-900 bg-emerald-400 hover:bg-emerald-300 shadow-md transition-all cursor-pointer text-center"
            >
              Agendar passeio agora
            </button>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Mundo do Passeio. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            Feito com <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> para cães felizes e tutores tranquilos.
          </p>
        </div>
      </div>
    </footer>
  );
};
