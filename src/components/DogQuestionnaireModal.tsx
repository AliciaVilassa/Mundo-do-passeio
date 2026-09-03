import React, { useState, useRef } from 'react';
import { DogProfile, DogSize, DogGender, EquipmentType } from '../types';
import {
  PERSONALITY_OPTIONS,
  STRANGER_OPTIONS,
  OTHER_DOGS_OPTIONS,
  PULL_LEASH_OPTIONS,
  ESCAPE_LEASH_OPTIONS,
  TRAFFIC_REACTION_OPTIONS,
  OTHER_ANIMALS_OPTIONS,
  FEAR_OPTIONS,
  EQUIPMENT_OPTIONS,
  FAVORITE_ACTIVITIES_OPTIONS,
  DOG_AVATARS,
  DEFAULT_DOG_PROFILE,
} from '../data/dogData';
import {
  X,
  Check,
  Camera,
  Upload,
  ShieldCheck,
  AlertTriangle,
  Heart,
  Dog,
  Sparkles,
  CheckCircle2,
  Info,
  ChevronDown,
  ArrowRight,
  BookmarkCheck,
  MessageCircle,
  Download,
  FileText,
  Globe,
  MapPin,
} from 'lucide-react';
import { BRAZILIAN_STATES, COUNTRIES } from '../utils/locations';
import {
  generateDogQuestionnairePDF,
  buildDogRegistrationWhatsAppMessage,
  openWhatsAppChat,
  WHATSAPP_TARGET_NUMBER,
} from '../utils/pdfAndWhatsApp';

interface DogQuestionnaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDog?: DogProfile;
  onSaveDog: (updatedDog: DogProfile) => void;
  onSelectLocation?: (country: string, state: string) => void;
}

export const DogQuestionnaireModal: React.FC<DogQuestionnaireModalProps> = ({
  isOpen,
  onClose,
  initialDog,
  onSaveDog,
  onSelectLocation,
}) => {
  const [formData, setFormData] = useState<DogProfile>(() => {
    return initialDog || DEFAULT_DOG_PROFILE;
  });

  const [customAvatarModalOpen, setCustomAvatarModalOpen] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [showSavedSuccess, setShowSavedSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Toggle personality checkbox
  const togglePersonality = (item: string) => {
    setFormData((prev) => {
      const exists = prev.personalityTraits.includes(item);
      const updated = exists
        ? prev.personalityTraits.filter((t) => t !== item)
        : [...prev.personalityTraits, item];
      return { ...prev, personalityTraits: updated };
    });
  };

  // Toggle fear checkbox
  const toggleFear = (item: string) => {
    setFormData((prev) => {
      const exists = prev.fears.includes(item);
      const updated = exists
        ? prev.fears.filter((f) => f !== item)
        : [...prev.fears, item];
      return { ...prev, fears: updated };
    });
  };

  // Toggle favorite activity checkbox
  const toggleActivity = (item: string) => {
    setFormData((prev) => {
      const exists = prev.favoriteActivities.includes(item);
      const updated = exists
        ? prev.favoriteActivities.filter((a) => a !== item)
        : [...prev.favoriteActivities, item];
      return { ...prev, favoriteActivities: updated };
    });
  };

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setFormData((prev) => ({ ...prev, photoUrl: result }));
          setCustomAvatarModalOpen(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!formData.name.trim()) {
      setValidationError('Por favor, informe o nome do seu cachorro.');
      document.getElementById('sec-1-info')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (!formData.confirmedSafetyTerms) {
      setValidationError('É necessário marcar a caixa de confirmação das informações de segurança.');
      document.getElementById('sec-confirmacao')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    setValidationError(null);
    onSaveDog(formData);

    // Sync app location to filter walkers to the dog tutor's country & state!
    if (onSelectLocation && formData.state) {
      onSelectLocation(formData.country || 'Brasil', formData.state);
    }

    // 1. Convert responses into PDF and download automatically
    try {
      generateDogQuestionnairePDF(formData);
    } catch (err) {
      console.error('Erro ao gerar PDF do questionário:', err);
    }

    // 2. Open WhatsApp to +55 (27) 99666-6164 with prefilled responses
    try {
      const msg = buildDogRegistrationWhatsAppMessage(formData);
      openWhatsAppChat(msg);
    } catch (err) {
      console.error('Erro ao abrir WhatsApp:', err);
    }

    setShowSavedSuccess(true);
  };

  const scrollToSec = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-emerald-100/70 relative flex flex-col">
        
        {/* Header Sticky */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 sm:px-8 py-5 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ECFDF5] text-[#047857] flex items-center justify-center text-xl">
              🐶
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#111827] tracking-tight">
                Questionário do Cachorro
              </h2>
              <p className="text-xs text-[#4B5563]">
                Focado em segurança e no que o passeador precisa saber sobre seu pet
              </p>
            </div>
          </div>

          <button
            id="btn-close-dog-questionnaire"
            onClick={onClose}
            className="p-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Nav Anchors */}
        <div className="bg-[#F9FAF7] px-6 py-2.5 border-b border-stone-200/60 overflow-x-auto flex items-center gap-2 text-xs font-semibold text-[#4B5563] scrollbar-none">
          <button onClick={() => scrollToSec('sec-1-info')} className="hover:text-[#047857] whitespace-nowrap px-2.5 py-1 rounded-lg hover:bg-white transition-colors cursor-pointer">
            1. Básicas
          </button>
          <span>·</span>
          <button onClick={() => scrollToSec('sec-2-personalidade')} className="hover:text-[#047857] whitespace-nowrap px-2.5 py-1 rounded-lg hover:bg-white transition-colors cursor-pointer">
            2. Personalidade 🐾
          </button>
          <span>·</span>
          <button onClick={() => scrollToSec('sec-3-comportamento')} className="hover:text-[#047857] whitespace-nowrap px-2.5 py-1 rounded-lg hover:bg-white transition-colors cursor-pointer">
            3. Passeio 🚶
          </button>
          <span>·</span>
          <button onClick={() => scrollToSec('sec-4-medos')} className="hover:text-[#047857] whitespace-nowrap px-2.5 py-1 rounded-lg hover:bg-white transition-colors cursor-pointer">
            4. Medos ⚠️
          </button>
          <span>·</span>
          <button onClick={() => scrollToSec('sec-5-saude')} className="hover:text-[#047857] whitespace-nowrap px-2.5 py-1 rounded-lg hover:bg-white transition-colors cursor-pointer">
            5. Saúde ❤️
          </button>
          <span>·</span>
          <button onClick={() => scrollToSec('sec-6-equipamento')} className="hover:text-[#047857] whitespace-nowrap px-2.5 py-1 rounded-lg hover:bg-white transition-colors cursor-pointer">
            6. Guia 🦮
          </button>
          <span>·</span>
          <button onClick={() => scrollToSec('sec-7-preferencias')} className="hover:text-[#047857] whitespace-nowrap px-2.5 py-1 rounded-lg hover:bg-white transition-colors cursor-pointer">
            7. Preferências 🐕
          </button>
          <span>·</span>
          <button onClick={() => scrollToSec('sec-8-alimentacao')} className="hover:text-[#047857] whitespace-nowrap px-2.5 py-1 rounded-lg hover:bg-white transition-colors cursor-pointer">
            8. Alimentação 🍖
          </button>
          <span>·</span>
          <button onClick={() => scrollToSec('sec-confirmacao')} className="hover:text-[#047857] text-[#047857] font-bold whitespace-nowrap px-2.5 py-1 rounded-lg hover:bg-white transition-colors cursor-pointer">
            ✅ Salvar
          </button>
        </div>

        {/* Questionnaire Form Body */}
        <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-10 flex-grow">
          
          {/* Validation Alert */}
          {validationError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-semibold flex items-center gap-2 animate-fadeIn">
              <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600" />
              <span>{validationError}</span>
            </div>
          )}

          {/* ========================================================= */}
          {/* 1. Informações básicas */}
          {/* ========================================================= */}
          <div id="sec-1-info" className="space-y-6 scroll-mt-28">
            <div className="flex items-center gap-2.5 pb-2 border-b border-stone-200">
              <span className="w-7 h-7 rounded-xl bg-[#047857] text-white font-black text-sm flex items-center justify-center">
                1
              </span>
              <h3 className="text-xl font-black text-[#111827]">
                Informações básicas
              </h3>
            </div>

            {/* Photo & Name Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
              {/* Photo uploader */}
              <div className="sm:col-span-4 flex flex-col items-center sm:items-start space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4B5563]">
                  Foto do cachorro:
                </label>
                <div className="relative group">
                  <img
                    src={formData.photoUrl || DOG_AVATARS[0].url}
                    alt={formData.name || 'Cachorro'}
                    className="w-28 h-28 rounded-3xl object-cover border-3 border-emerald-200 shadow-md bg-stone-100"
                  />
                  <button
                    type="button"
                    onClick={() => setCustomAvatarModalOpen(true)}
                    className="absolute inset-0 bg-stone-900/40 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-bold cursor-pointer"
                  >
                    <Camera className="w-6 h-6 mb-1" />
                    <span>Alterar</span>
                  </button>
                </div>

                <button
                  type="button"
                  id="btn-add-dog-photo"
                  onClick={() => setCustomAvatarModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#047857] bg-[#ECFDF5] hover:bg-[#D1FAE5] border border-[#D1FAE5] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>+ Adicionar foto</span>
                </button>
              </div>

              {/* Basic Fields */}
              <div className="sm:col-span-8 space-y-4">
                {/* Nome */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#4B5563] block">
                    Nome do cachorro: *
                  </label>
                  <input
                    type="text"
                    id="input-dog-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Thor, Mel, Bob..."
                    className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm font-semibold text-[#111827] focus:outline-none focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/20 bg-stone-50/70"
                    required
                  />
                </div>

                {/* Idade & Raça */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#4B5563] block">
                      Idade:
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="input-dog-age"
                        min="0"
                        max="25"
                        value={formData.age}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            age: e.target.value === '' ? '' : Number(e.target.value),
                          })
                        }
                        placeholder="Ex: 3"
                        className="w-full px-4 py-3 pr-16 rounded-2xl border border-stone-200 text-sm font-semibold text-[#111827] focus:outline-none focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/20 bg-stone-50/70"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#4B5563]">
                        anos
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#4B5563] block">
                      Raça:
                    </label>
                    <input
                      type="text"
                      id="input-dog-breed"
                      value={formData.breed}
                      onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                      placeholder="Ex: Golden, SRD, Poodle..."
                      className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm font-semibold text-[#111827] focus:outline-none focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/20 bg-stone-50/70"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Porte, Sexo, Castrado */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
              {/* Porte */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4B5563] block">
                  Porte:
                </label>
                <div className="space-y-1.5">
                  {(['Pequeno', 'Médio', 'Grande'] as DogSize[]).map((size) => {
                    const isSelected = formData.size === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setFormData({ ...formData, size })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#ECFDF5] border-[#047857] text-[#047857]'
                            : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-[#111827]'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-[#047857] bg-[#047857]' : 'border-stone-400 bg-white'
                          }`}>
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                          {size}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sexo */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4B5563] block">
                  Sexo:
                </label>
                <div className="space-y-1.5">
                  {(['Macho', 'Fêmea'] as DogGender[]).map((gender) => {
                    const isSelected = formData.gender === gender;
                    return (
                      <button
                        key={gender}
                        type="button"
                        onClick={() => setFormData({ ...formData, gender })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#ECFDF5] border-[#047857] text-[#047857]'
                            : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-[#111827]'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-[#047857] bg-[#047857]' : 'border-stone-400 bg-white'
                          }`}>
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                          {gender}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Castrado? */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4B5563] block">
                  Castrado?
                </label>
                <div className="space-y-1.5">
                  {[
                    { label: 'Sim', val: true },
                    { label: 'Não', val: false },
                  ].map((item) => {
                    const isSelected = formData.neutered === item.val;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => setFormData({ ...formData, neutered: item.val })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#ECFDF5] border-[#047857] text-[#047857]'
                            : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-[#111827]'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-[#047857] bg-[#047857]' : 'border-stone-400 bg-white'
                          }`}>
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                          {item.label}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Localização: País e Estado (Para filtrar passeadores da região) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] space-y-3">
              <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
                <Globe className="w-4 h-4 text-[#047857]" />
                <span>Localização: De qual país e estado vocês são? 📍</span>
              </div>
              <p className="text-xs text-stone-600">
                Ao informar seu país e estado, a plataforma mostrará automaticamente os passeadores disponíveis na sua região.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 block">País *</label>
                  <select
                    value={formData.country || 'Brasil'}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#047857] cursor-pointer"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 block">Estado *</label>
                  <select
                    value={formData.state || 'ES'}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#047857] cursor-pointer"
                  >
                    {BRAZILIAN_STATES.map((st) => (
                      <option key={st.code} value={st.code}>
                        {st.code} - {st.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 block">Cidade / Bairro</label>
                  <input
                    type="text"
                    value={formData.city || ''}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Ex: Vitória / Jardim da Penha"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#047857]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 2. Personalidade 🐾 */}
          {/* ========================================================= */}
          <div id="sec-2-personalidade" className="space-y-6 pt-6 border-t border-stone-200 scroll-mt-28">
            <div className="flex items-center gap-2.5 pb-2 border-b border-stone-200">
              <span className="w-7 h-7 rounded-xl bg-[#047857] text-white font-black text-sm flex items-center justify-center">
                2
              </span>
              <h3 className="text-xl font-black text-[#111827]">
                Personalidade 🐾
              </h3>
            </div>

            {/* Como você descreveria seu cachorro? */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-[#4B5563] block">
                Como você descreveria seu cachorro?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {PERSONALITY_OPTIONS.map((trait) => {
                  const isChecked = formData.personalityTraits.includes(trait);
                  return (
                    <button
                      key={trait}
                      type="button"
                      onClick={() => togglePersonality(trait)}
                      className={`px-3.5 py-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                        isChecked
                          ? 'bg-[#047857] text-white border-[#047857] shadow-xs'
                          : 'bg-stone-50 hover:bg-stone-100 text-[#111827] border-stone-200'
                      }`}
                    >
                      <span>{trait}</span>
                      {isChecked ? (
                        <Check className="w-4 h-4 stroke-[3]" />
                      ) : (
                        <span className="w-4 h-4 rounded border border-stone-300 bg-white" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Outro: */}
              <div className="pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#4B5563] whitespace-nowrap">Outro:</span>
                  <input
                    type="text"
                    value={formData.personalityOther || ''}
                    onChange={(e) => setFormData({ ...formData, personalityOther: e.target.value })}
                    placeholder="Ex: Curioso, manhoso, leal..."
                    className="flex-1 px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-[#111827] focus:outline-none focus:border-[#047857] bg-stone-50"
                  />
                </div>
              </div>
            </div>

            {/* Comportamento com pessoas desconhecidas */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#4B5563] block">
                Como ele se comporta com pessoas desconhecidas?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {STRANGER_OPTIONS.map((option) => {
                  const isSelected = formData.strangerReaction === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFormData({ ...formData, strangerReaction: option })}
                      className={`p-3 rounded-2xl border text-xs font-semibold text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#ECFDF5] border-[#047857] text-[#047857] font-bold shadow-xs'
                          : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-[#111827]'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-[#047857] bg-[#047857]' : 'border-stone-400 bg-white'
                        }`}>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </span>
                        {option}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comportamento com outros cachorros */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#4B5563] block">
                Como ele se comporta com outros cachorros?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {OTHER_DOGS_OPTIONS.map((option) => {
                  const isSelected = formData.dogReaction === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFormData({ ...formData, dogReaction: option })}
                      className={`p-3 rounded-2xl border text-xs font-semibold text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#ECFDF5] border-[#047857] text-[#047857] font-bold shadow-xs'
                          : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-[#111827]'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-[#047857] bg-[#047857]' : 'border-stone-400 bg-white'
                        }`}>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </span>
                        {option}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 3. Comportamento durante o passeio 🚶 */}
          {/* ========================================================= */}
          <div id="sec-3-comportamento" className="space-y-6 pt-6 border-t border-stone-200 scroll-mt-28">
            <div className="flex items-center gap-2.5 pb-2 border-b border-stone-200">
              <span className="w-7 h-7 rounded-xl bg-[#047857] text-white font-black text-sm flex items-center justify-center">
                3
              </span>
              <h3 className="text-xl font-black text-[#111827]">
                Comportamento durante o passeio 🚶
              </h3>
            </div>

            {/* Puxa guia & Foge da guia */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Ele costuma puxar a guia? */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4B5563] block">
                  Ele costuma puxar a guia?
                </label>
                <div className="space-y-1.5">
                  {PULL_LEASH_OPTIONS.map((option) => {
                    const isSelected = formData.pullsLeash === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setFormData({ ...formData, pullsLeash: option })}
                        className={`w-full p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#ECFDF5] border-[#047857] text-[#047857] font-bold'
                            : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-[#111827]'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-[#047857] bg-[#047857]' : 'border-stone-400 bg-white'
                          }`}>
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                          {option}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ele costuma fugir ou tentar escapar da guia? */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4B5563] block">
                  Ele costuma fugir ou tentar escapar da guia?
                </label>
                <div className="space-y-1.5">
                  {ESCAPE_LEASH_OPTIONS.map((option) => {
                    const isSelected = formData.escapesLeash === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setFormData({ ...formData, escapesLeash: option })}
                        className={`w-full p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#ECFDF5] border-[#047857] text-[#047857] font-bold'
                            : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-[#111827]'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-[#047857] bg-[#047857]' : 'border-stone-400 bg-white'
                          }`}>
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                          {option}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Reação a bicicletas, motos e carros */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#4B5563] block">
                Como reage a bicicletas, motos e carros?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {TRAFFIC_REACTION_OPTIONS.map((option) => {
                  const isSelected = formData.reactionBikesCars === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFormData({ ...formData, reactionBikesCars: option })}
                      className={`p-3 rounded-2xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#ECFDF5] border-[#047857] text-[#047857] font-bold shadow-xs'
                          : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-[#111827]'
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reação a outros animais */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#4B5563] block">
                Como reage a outros animais?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {OTHER_ANIMALS_OPTIONS.map((option) => {
                  const isSelected = formData.reactionOtherAnimals === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFormData({ ...formData, reactionOtherAnimals: option })}
                      className={`p-2.5 rounded-2xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#ECFDF5] border-[#047857] text-[#047857] font-bold shadow-xs'
                          : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-[#111827]'
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Existe algum comportamento que o passeador precisa conhecer? */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#4B5563] block">
                Existe algum comportamento que o passeador precisa conhecer?
              </label>
              <textarea
                id="input-behavior-note"
                rows={3}
                value={formData.walkerNeedsToKnowBehavior || ''}
                onChange={(e) =>
                  setFormData({ ...formData, walkerNeedsToKnowBehavior: e.target.value })
                }
                placeholder="Ex: Para para cheirar postes com frequência, pode se assustar com guarda-chuvas abertos, etc."
                className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm font-semibold text-[#111827] focus:outline-none focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/20 bg-stone-50/70 leading-relaxed"
              />
            </div>
          </div>

          {/* ========================================================= */}
          {/* 4. Medos e coisas que devem ser evitadas ⚠️ */}
          {/* ========================================================= */}
          <div id="sec-4-medos" className="space-y-6 pt-6 border-t border-stone-200 scroll-mt-28">
            <div className="flex items-center gap-2.5 pb-2 border-b border-stone-200">
              <span className="w-7 h-7 rounded-xl bg-[#047857] text-white font-black text-sm flex items-center justify-center">
                4
              </span>
              <h3 className="text-xl font-black text-[#111827]">
                Medos e coisas que devem ser evitadas ⚠️
              </h3>
            </div>

            {/* Seu cachorro tem medo de alguma coisa? */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-[#4B5563] block">
                Seu cachorro tem medo de alguma coisa?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {FEAR_OPTIONS.map((fear) => {
                  const isChecked = formData.fears.includes(fear);
                  return (
                    <button
                      key={fear}
                      type="button"
                      onClick={() => toggleFear(fear)}
                      className={`px-3.5 py-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                        isChecked
                          ? 'bg-[#047857] text-white border-[#047857] shadow-xs'
                          : 'bg-stone-50 hover:bg-stone-100 text-[#111827] border-stone-200'
                      }`}
                    >
                      <span>{fear}</span>
                      {isChecked ? (
                        <Check className="w-4 h-4 stroke-[3]" />
                      ) : (
                        <span className="w-4 h-4 rounded border border-stone-300 bg-white" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Outros: */}
              <div className="pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#4B5563] whitespace-nowrap">Outros:</span>
                  <input
                    type="text"
                    value={formData.fearsOther || ''}
                    onChange={(e) => setFormData({ ...formData, fearsOther: e.target.value })}
                    placeholder="Ex: Vassouras, skates, pessoas de boné..."
                    className="flex-1 px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-[#111827] focus:outline-none focus:border-[#047857] bg-stone-50"
                  />
                </div>
              </div>
            </div>

            {/* Existe algum lugar ou situação que devemos evitar? */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#4B5563] block">
                Existe algum lugar ou situação que devemos evitar?
              </label>
              <textarea
                rows={2}
                value={formData.placesSituationsToAvoid || ''}
                onChange={(e) =>
                  setFormData({ ...formData, placesSituationsToAvoid: e.target.value })
                }
                placeholder="Ex: Avenidas muito movimentadas, praças com muitos pombos, obras com barulho alto..."
                className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm font-semibold text-[#111827] focus:outline-none focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/20 bg-stone-50/70"
              />
            </div>
          </div>

          {/* ========================================================= */}
          {/* 5. Saúde e cuidados ❤️ */}
          {/* ========================================================= */}
          <div id="sec-5-saude" className="space-y-6 pt-6 border-t border-stone-200 scroll-mt-28">
            <div className="flex items-center gap-2.5 pb-2 border-b border-stone-200">
              <span className="w-7 h-7 rounded-xl bg-[#047857] text-white font-black text-sm flex items-center justify-center">
                5
              </span>
              <h3 className="text-xl font-black text-[#111827]">
                Saúde e cuidados ❤️
              </h3>
            </div>

            {/* 1. Informação de saúde */}
            <div className="space-y-3 p-4 rounded-2xl bg-stone-50 border border-stone-200/70">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#111827]">
                  Existe alguma informação de saúde que o passeador precisa saber?
                </label>
                <div className="flex items-center gap-2">
                  {[
                    { label: 'Não', val: false },
                    { label: 'Sim', val: true },
                  ].map((btn) => (
                    <button
                      key={btn.label}
                      type="button"
                      onClick={() => setFormData({ ...formData, hasHealthInfo: btn.val })}
                      className={`px-3 py-1 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                        formData.hasHealthInfo === btn.val
                          ? 'bg-[#047857] text-white border-[#047857]'
                          : 'bg-white text-[#4B5563] border-stone-200'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {formData.hasHealthInfo && (
                <div className="pt-2 animate-fadeIn">
                  <label className="text-xs font-semibold text-[#4B5563] block mb-1">
                    Se sim, descreva a condição de saúde:
                  </label>
                  <textarea
                    rows={2}
                    value={formData.healthInfoDetails || ''}
                    onChange={(e) => setFormData({ ...formData, healthInfoDetails: e.target.value })}
                    placeholder="Ex: Displasia leve, cardiopatia controlada, etc."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-medium text-[#111827] focus:outline-none focus:border-[#047857] bg-white"
                  />
                </div>
              )}
            </div>

            {/* 2. Possui alguma alergia? */}
            <div className="space-y-3 p-4 rounded-2xl bg-stone-50 border border-stone-200/70">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#111827]">
                  Possui alguma alergia?
                </label>
                <div className="flex items-center gap-2">
                  {[
                    { label: 'Não', val: false },
                    { label: 'Sim', val: true },
                  ].map((btn) => (
                    <button
                      key={btn.label}
                      type="button"
                      onClick={() => setFormData({ ...formData, hasAllergies: btn.val })}
                      className={`px-3 py-1 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                        formData.hasAllergies === btn.val
                          ? 'bg-[#047857] text-white border-[#047857]'
                          : 'bg-white text-[#4B5563] border-stone-200'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {formData.hasAllergies && (
                <div className="pt-2 animate-fadeIn">
                  <label className="text-xs font-semibold text-[#4B5563] block mb-1">
                    Sim — Qual?
                  </label>
                  <input
                    type="text"
                    value={formData.allergyDetails || ''}
                    onChange={(e) => setFormData({ ...formData, allergyDetails: e.target.value })}
                    placeholder="Ex: Alergia a frango, picada de pulga, pólen..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-medium text-[#111827] focus:outline-none focus:border-[#047857] bg-white"
                  />
                </div>
              )}
            </div>

            {/* 3. Possui alguma restrição durante o passeio? */}
            <div className="space-y-3 p-4 rounded-2xl bg-stone-50 border border-stone-200/70">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#111827]">
                  Possui alguma restrição durante o passeio?
                </label>
                <div className="flex items-center gap-2">
                  {[
                    { label: 'Não', val: false },
                    { label: 'Sim', val: true },
                  ].map((btn) => (
                    <button
                      key={btn.label}
                      type="button"
                      onClick={() => setFormData({ ...formData, hasWalkingRestrictions: btn.val })}
                      className={`px-3 py-1 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                        formData.hasWalkingRestrictions === btn.val
                          ? 'bg-[#047857] text-white border-[#047857]'
                          : 'bg-white text-[#4B5563] border-stone-200'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {formData.hasWalkingRestrictions && (
                <div className="pt-2 animate-fadeIn">
                  <label className="text-xs font-semibold text-[#4B5563] block mb-1">
                    Sim — Qual?
                  </label>
                  <input
                    type="text"
                    value={formData.walkingRestrictionsDetails || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, walkingRestrictionsDetails: e.target.value })
                    }
                    placeholder="Ex: Não correr, evitar ladeiras íngremes, caminhadas de no máximo 30 min..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-medium text-[#111827] focus:outline-none focus:border-[#047857] bg-white"
                  />
                </div>
              )}
            </div>

            {/* 4. Precisa de algum cuidado especial? */}
            <div className="space-y-3 p-4 rounded-2xl bg-stone-50 border border-stone-200/70">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#111827]">
                  Precisa de algum cuidado especial?
                </label>
                <div className="flex items-center gap-2">
                  {[
                    { label: 'Não', val: false },
                    { label: 'Sim', val: true },
                  ].map((btn) => (
                    <button
                      key={btn.label}
                      type="button"
                      onClick={() => setFormData({ ...formData, hasSpecialCare: btn.val })}
                      className={`px-3 py-1 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                        formData.hasSpecialCare === btn.val
                          ? 'bg-[#047857] text-white border-[#047857]'
                          : 'bg-white text-[#4B5563] border-stone-200'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {formData.hasSpecialCare && (
                <div className="pt-2 animate-fadeIn">
                  <label className="text-xs font-semibold text-[#4B5563] block mb-1">
                    Sim — Explique:
                  </label>
                  <textarea
                    rows={2}
                    value={formData.specialCareDetails || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, specialCareDetails: e.target.value })
                    }
                    placeholder="Ex: Oferecer água fresca na volta, secar patas se chover, pausas frequentes na sombra..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-medium text-[#111827] focus:outline-none focus:border-[#047857] bg-white"
                  />
                </div>
              )}
            </div>
          </div>

          {/* ========================================================= */}
          {/* 6. Guia e equipamentos 🦮 */}
          {/* ========================================================= */}
          <div id="sec-6-equipamento" className="space-y-6 pt-6 border-t border-stone-200 scroll-mt-28">
            <div className="flex items-center gap-2.5 pb-2 border-b border-stone-200">
              <span className="w-7 h-7 rounded-xl bg-[#047857] text-white font-black text-sm flex items-center justify-center">
                6
              </span>
              <h3 className="text-xl font-black text-[#111827]">
                Guia e equipamentos 🦮
              </h3>
            </div>

            {/* Qual equipamento ele usa para passear? */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#4B5563] block">
                Qual equipamento ele usa para passear?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[...EQUIPMENT_OPTIONS, 'Outro'].map((equip) => {
                  const isSelected = formData.equipmentType === equip;
                  return (
                    <button
                      key={equip}
                      type="button"
                      onClick={() => setFormData({ ...formData, equipmentType: equip as EquipmentType })}
                      className={`p-3 rounded-2xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#ECFDF5] border-[#047857] text-[#047857] font-bold shadow-xs'
                          : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-[#111827]'
                      }`}
                    >
                      {equip}
                    </button>
                  );
                })}
              </div>

              {formData.equipmentType === 'Outro' && (
                <div className="pt-2 animate-fadeIn flex items-center gap-2">
                  <span className="text-xs font-bold text-[#4B5563] whitespace-nowrap">Outro:</span>
                  <input
                    type="text"
                    value={formData.equipmentOther || ''}
                    onChange={(e) => setFormData({ ...formData, equipmentOther: e.target.value })}
                    placeholder="Ex: Gentle leader, enforcador de fita suave..."
                    className="flex-1 px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-[#111827] focus:outline-none focus:border-[#047857] bg-stone-50"
                  />
                </div>
              )}
            </div>

            {/* Ele usa algum equipamento especial? */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#4B5563] block">
                Ele usa algum equipamento especial?
              </label>
              <textarea
                rows={2}
                value={formData.specialEquipmentNotes || ''}
                onChange={(e) =>
                  setFormData({ ...formData, specialEquipmentNotes: e.target.value })
                }
                placeholder="Ex: Focinheira de plástico para socialização, luz de led noturna na coleira, etc."
                className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm font-semibold text-[#111827] focus:outline-none focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/20 bg-stone-50/70"
              />
            </div>
          </div>

          {/* ========================================================= */}
          {/* 7. Preferências do cachorro 🐕 */}
          {/* ========================================================= */}
          <div id="sec-7-preferencias" className="space-y-6 pt-6 border-t border-stone-200 scroll-mt-28">
            <div className="flex items-center gap-2.5 pb-2 border-b border-stone-200">
              <span className="w-7 h-7 rounded-xl bg-[#047857] text-white font-black text-sm flex items-center justify-center">
                7
              </span>
              <h3 className="text-xl font-black text-[#111827]">
                Preferências do cachorro 🐕
              </h3>
            </div>

            {/* O que ele mais gosta durante o passeio? */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-[#4B5563] block">
                O que ele mais gosta durante o passeio?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {FAVORITE_ACTIVITIES_OPTIONS.map((act) => {
                  const isChecked = formData.favoriteActivities.includes(act);
                  return (
                    <button
                      key={act}
                      type="button"
                      onClick={() => toggleActivity(act)}
                      className={`px-3.5 py-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                        isChecked
                          ? 'bg-[#047857] text-white border-[#047857] shadow-xs'
                          : 'bg-stone-50 hover:bg-stone-100 text-[#111827] border-stone-200'
                      }`}
                    >
                      <span>{act}</span>
                      {isChecked ? (
                        <Check className="w-4 h-4 stroke-[3]" />
                      ) : (
                        <span className="w-4 h-4 rounded border border-stone-300 bg-white" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Outro: */}
              <div className="pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#4B5563] whitespace-nowrap">Outro:</span>
                  <input
                    type="text"
                    value={formData.favoriteActivitiesOther || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, favoriteActivitiesOther: e.target.value })
                    }
                    placeholder="Ex: Sentar e observar o movimento, brincar de pegar galhos..."
                    className="flex-1 px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-[#111827] focus:outline-none focus:border-[#047857] bg-stone-50"
                  />
                </div>
              </div>
            </div>

            {/* Existe alguma coisa que deixa seu cachorro especialmente feliz? */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#4B5563] block">
                Existe alguma coisa que deixa seu cachorro especialmente feliz?
              </label>
              <textarea
                rows={2}
                value={formData.makesDogHappy || ''}
                onChange={(e) => setFormData({ ...formData, makesDogHappy: e.target.value })}
                placeholder="Ex: Elogios com voz animada, brincar com a bolinha de tênis, carinho nas costas..."
                className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm font-semibold text-[#111827] focus:outline-none focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/20 bg-stone-50/70"
              />
            </div>
          </div>

          {/* ========================================================= */}
          {/* 8. Alimentação e recompensas 🍖 */}
          {/* ========================================================= */}
          <div id="sec-8-alimentacao" className="space-y-6 pt-6 border-t border-stone-200 scroll-mt-28">
            <div className="flex items-center gap-2.5 pb-2 border-b border-stone-200">
              <span className="w-7 h-7 rounded-xl bg-[#047857] text-white font-black text-sm flex items-center justify-center">
                8
              </span>
              <h3 className="text-xl font-black text-[#111827]">
                Alimentação e recompensas 🍖
              </h3>
            </div>

            {/* Pode receber petiscos durante o passeio? */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#4B5563] block">
                Pode receber petiscos durante o passeio?
              </label>
              <div className="grid grid-cols-2 gap-3 max-w-sm">
                {[
                  { label: 'Sim', val: true },
                  { label: 'Não', val: false },
                ].map((item) => {
                  const isSelected = formData.canReceiveTreats === item.val;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setFormData({ ...formData, canReceiveTreats: item.val })}
                      className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#ECFDF5] border-[#047857] text-[#047857]'
                          : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-[#111827]'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-[#047857] bg-[#047857]' : 'border-stone-400 bg-white'
                        }`}>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </span>
                        {item.label}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Existe algum alimento que NÃO pode receber? */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#4B5563] block">
                Existe algum alimento que NÃO pode receber?
              </label>
              <textarea
                rows={2}
                value={formData.forbiddenFoods || ''}
                onChange={(e) => setFormData({ ...formData, forbiddenFoods: e.target.value })}
                placeholder="Ex: Não pode receber petiscos com corantes, derivados de leite, ossos desidratados, etc."
                className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm font-semibold text-[#111827] focus:outline-none focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/20 bg-stone-50/70"
              />
            </div>
          </div>

          {/* ========================================================= */}
          {/* ✅ Confirmação */}
          {/* ========================================================= */}
          <div id="sec-confirmacao" className="pt-6 border-t-2 border-emerald-100 space-y-5 scroll-mt-28">
            <div className="p-5 rounded-3xl bg-[#ECFDF5] border-2 border-[#D1FAE5] space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-[#047857]">
                <ShieldCheck className="w-5 h-5 text-[#047857]" />
                <span>Confirmação de Segurança Pet</span>
              </div>

              {/* Exact user checkbox */}
              <label className="flex items-start gap-3 cursor-pointer select-none group">
                <div className="relative flex items-center justify-center mt-0.5">
                  <input
                    type="checkbox"
                    id="checkbox-confirm-safety"
                    checked={formData.confirmedSafetyTerms}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmedSafetyTerms: e.target.checked })
                    }
                    className="sr-only"
                  />
                  <div
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                      formData.confirmedSafetyTerms
                        ? 'bg-[#047857] border-[#047857] text-white shadow-xs'
                        : 'border-stone-400 bg-white group-hover:border-[#047857]'
                    }`}
                  >
                    {formData.confirmedSafetyTerms && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                </div>

                <p className="text-xs sm:text-sm font-semibold text-[#111827] leading-relaxed">
                  Confirmo que as informações fornecidas sobre meu cachorro estão corretas e que informei qualquer comportamento ou cuidado importante para a segurança do animal durante o passeio.
                </p>
              </label>

              {/* 🛡️ LGPD: Consentimento Explícito e Destacado para Uso de Imagem (Não Pré-marcado) */}
              <div className="pt-3 border-t border-emerald-200/80">
                <label className="flex items-start gap-3 cursor-pointer select-none group">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input
                      type="checkbox"
                      id="checkbox-marketing-photos-consent"
                      checked={Boolean(formData.marketingPhotosConsent)}
                      onChange={(e) =>
                        setFormData({ ...formData, marketingPhotosConsent: e.target.checked })
                      }
                      className="sr-only"
                    />
                    <div
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                        formData.marketingPhotosConsent
                          ? 'bg-[#047857] border-[#047857] text-white shadow-xs'
                          : 'border-stone-400 bg-white group-hover:border-[#047857]'
                      }`}
                    >
                      {formData.marketingPhotosConsent && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <p className="font-bold text-[#111827] leading-relaxed">
                      Autorizo o uso de fotos e vídeos do meu pet durante passeios no site e redes sociais do Mundo do Passeio para fins de divulgação.
                    </p>
                    <p className="text-stone-500 text-[11px] leading-relaxed">
                      <strong>Conformidade LGPD (Art. 7º, I e Art. 18):</strong> O consentimento de imagem é 100% opcional. Você pode revogá-lo a qualquer momento na Central de Privacidade, garantindo a imediata remoção de todas as fotos publicadas.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Success state banner & actions */}
            {showSavedSuccess && (
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/60 border-2 border-[#047857]/30 space-y-4 animate-fadeIn">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#047857] text-white flex items-center justify-center shrink-0 text-xl shadow-sm">
                    ✓
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base sm:text-lg font-black text-emerald-950">
                      Questionário Concluído com Sucesso! 🐶
                    </h4>
                    <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
                      As respostas sobre o <strong>{formData.name}</strong> viraram um <strong>PDF Oficial</strong> e foram encaminhadas para o WhatsApp <strong>{WHATSAPP_TARGET_NUMBER}</strong>!
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-white/80 rounded-2xl border border-emerald-200 text-xs text-stone-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#047857] shrink-0" />
                  <span>
                    Região configurada: <strong>{formData.city ? `${formData.city}, ` : ''}{formData.state || 'ES'} • {formData.country || 'Brasil'}</strong>. Os passeadores desse estado já foram filtrados!
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => generateDogQuestionnairePDF(formData)}
                    className="px-4 py-2.5 rounded-xl bg-white hover:bg-stone-50 border border-emerald-300 text-emerald-900 font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-emerald-700" />
                    <span>Baixar PDF novamente</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const msg = buildDogRegistrationWhatsAppMessage(formData);
                      openWhatsAppChat(msg);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Reabrir WhatsApp ({WHATSAPP_TARGET_NUMBER})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      const el = document.getElementById('passeadores');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#047857] hover:bg-[#065F46] text-white font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer ml-auto"
                  >
                    <span>Ver Passeadores em {formData.state || 'ES'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Submit button with exact requested label */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full text-sm font-bold text-stone-600 hover:bg-stone-100 border border-stone-200 transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="submit"
                id="btn-save-dog-questionnaire"
                className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-bold text-white bg-[#047857] hover:bg-[#065F46] active:scale-[0.98] shadow-lg shadow-[#047857]/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer group"
              >
                <BookmarkCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Salvar cadastro do cachorro</span>
                <span>🐾</span>
              </button>
            </div>
          </div>

        </form>

        {/* Modal for selecting avatar / uploading custom photo */}
        {customAvatarModalOpen && (
          <div className="fixed inset-0 z-60 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-emerald-100/70">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h4 className="text-base font-bold text-[#111827]">
                  Escolher foto do cachorro
                </h4>
                <button
                  onClick={() => setCustomAvatarModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Upload from device */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#4B5563] uppercase tracking-wider block">
                  1. Enviar do seu dispositivo:
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 px-4 rounded-2xl border-2 border-dashed border-emerald-300 bg-[#ECFDF5]/50 hover:bg-[#ECFDF5] text-[#047857] text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span>Escolher arquivo de imagem</span>
                </button>
              </div>

              {/* Or paste link */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#4B5563] uppercase tracking-wider block">
                  2. Ou colar link direto de imagem:
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="https://exemplo.com/foto.jpg"
                    className="flex-1 px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#047857]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (imageUrlInput.trim()) {
                        setFormData((prev) => ({ ...prev, photoUrl: imageUrlInput.trim() }));
                        setCustomAvatarModalOpen(false);
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-[#047857] text-white text-xs font-bold cursor-pointer hover:bg-[#065F46]"
                  >
                    Usar
                  </button>
                </div>
              </div>

              {/* Or select preset */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <label className="text-xs font-bold text-[#4B5563] uppercase tracking-wider block">
                  3. Ou escolha uma foto padrão:
                </label>
                <div className="grid grid-cols-4 gap-2.5">
                  {DOG_AVATARS.map((avatar, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, photoUrl: avatar.url }));
                        setCustomAvatarModalOpen(false);
                      }}
                      className="group relative rounded-2xl overflow-hidden aspect-square border-2 border-transparent hover:border-[#047857] cursor-pointer"
                    >
                      <img
                        src={avatar.url}
                        alt={avatar.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
