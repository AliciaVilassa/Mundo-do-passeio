import React from 'react';
import { X, Dog, HeartHandshake, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

interface WelcomeChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChooseDogQuestionnaire: () => void;
  onChooseBecomeWalker: () => void;
}

export const WelcomeChoiceModal: React.FC<WelcomeChoiceModalProps> = ({
  isOpen,
  onClose,
  onChooseDogQuestionnaire,
  onChooseBecomeWalker,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 relative my-auto">
        {/* Close Button */}
        <button
          id="close-welcome-choice-modal"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-stone-900 transition-all shadow-md cursor-pointer"
          aria-label="Fechar e navegar no site"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image Header */}
        <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-stone-900">
          <img
            src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80"
            alt="Cachorros felizes passeando no parque"
            className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

          {/* Floating Pill Tag */}
          <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#047857] text-xs font-black shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bem-vindo à PasseioPet</span>
          </div>

          {/* Title on Image */}
          <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 text-white">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              Como você deseja começar?
            </h2>
            <p className="text-stone-200 text-xs sm:text-sm mt-1 max-w-lg leading-relaxed font-medium">
              Conectamos tutores que buscam passeios seguros e enriquecedores a passeadores apaixonados e verificados.
            </p>
          </div>
        </div>

        {/* Action Choice Cards */}
        <div className="p-5 sm:p-7 space-y-4 bg-[#FBFBFA]">
          <p className="text-xs font-bold text-stone-500 uppercase tracking-wider text-center">
            Selecione uma opção para continuar:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Option 1: Cadastrar Cachorro (Tutor) */}
            <button
              id="btn-choice-cadastrar-cachorro"
              onClick={() => {
                onClose();
                onChooseDogQuestionnaire();
              }}
              className="group relative text-left p-5 rounded-2xl bg-white border-2 border-emerald-200 hover:border-emerald-600 hover:shadow-xl transition-all duration-200 flex flex-col justify-between cursor-pointer"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#047857] group-hover:scale-110 group-hover:bg-[#047857] group-hover:text-white transition-all shadow-xs">
                  <Dog className="w-6 h-6" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#047857] bg-emerald-50 px-2 py-0.5 rounded-full mb-1">
                    <span>Para Tutores de Cães</span>
                  </div>
                  <h3 className="text-base font-black text-[#111827] group-hover:text-[#047857] transition-colors">
                    🐶 Cadastrar meu Cachorro
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    Preencha o <strong>questionário completo em 8 etapas</strong> sobre a rotina, personalidade e cuidados do seu cão.
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-[#047857]">
                <span>Abrir Questionário</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Option 2: Seja Passeador */}
            <button
              id="btn-choice-ser-passeador"
              onClick={() => {
                onClose();
                onChooseBecomeWalker();
              }}
              className="group relative text-left p-5 rounded-2xl bg-white border-2 border-amber-200 hover:border-amber-600 hover:shadow-xl transition-all duration-200 flex flex-col justify-between cursor-pointer"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-xs">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full mb-1">
                    <span>Oportunidade de Renda</span>
                  </div>
                  <h3 className="text-base font-black text-[#111827] group-hover:text-amber-700 transition-colors">
                    🦮 Quero ser Passeador
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    Cadastro completo com <strong>10 etapas</strong>, envio de documentos, certidão e perfil público verificado.
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-amber-700">
                <span>Iniciar Cadastro</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>

          {/* Footer note and skip */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
            <div className="flex items-center gap-1.5 text-stone-600">
              <ShieldCheck className="w-4 h-4 text-[#047857]" />
              <span>Plataforma 100% segura com suporte e seguro veterinário</span>
            </div>

            <button
              id="btn-explore-without-choice"
              onClick={onClose}
              className="text-stone-500 hover:text-stone-900 font-semibold underline underline-offset-4 cursor-pointer text-xs"
            >
              Explorar a plataforma primeiro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
