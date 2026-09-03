import React, { useState } from 'react';
import {
  X,
  User,
  MapPin,
  FileText,
  Shield,
  Dog,
  Calendar,
  Compass,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Upload,
  Clock,
  Car,
  Eye,
  Check,
  Award,
  ChevronRight,
  ChevronLeft,
  Star,
  FileCheck,
  RefreshCw,
  MessageCircle,
  Download,
  Globe,
} from 'lucide-react';
import { DAYS_OF_WEEK } from '../data/walkers';
import { WalkerApplication, WalkerStatus, Walker } from '../types';
import { BRAZILIAN_STATES, COUNTRIES } from '../utils/locations';
import {
  generateWalkerApplicationPDF,
  buildWalkerApplicationWhatsAppMessage,
  openWhatsAppChat,
  WHATSAPP_TARGET_NUMBER,
} from '../utils/pdfAndWhatsApp';

interface BecomeWalkerProps {
  isOpen: boolean;
  onClose: () => void;
  onWalkerSubmitted?: (application: WalkerApplication) => void;
  onAddWalkerToPlatform?: (walker: Walker) => void;
}

const INITIAL_FORM: WalkerApplication = {
  // 1. Dados pessoais
  fullName: 'João Silva',
  birthDate: '1995-06-15',
  cpf: '123.456.789-00',
  phone: '(27) 99666-6164',
  email: 'joao.silva@mundodopasseio.com.br',
  photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',

  // 2. Endereço
  cep: '29055-000',
  street: 'Avenida Dante Michelini',
  number: '1200',
  complement: 'Apto 402',
  neighborhood: 'Jardim da Penha',
  city: 'Vitória',
  state: 'ES',
  country: 'Brasil',
  residenceProofFileName: 'comprovante_residencia_julho2026.pdf',
  residenceProofUrl: 'https://exemplo.com/docs/residencia.pdf',

  // 3. Certidão de antecedentes criminais
  criminalRecordFileName: 'certidao_antecedentes_pf_2026.pdf',
  criminalRecordUrl: 'https://exemplo.com/docs/certidao.pdf',
  criminalRecordIssueDate: '2026-07-10',
  criminalRecordIssuingAuthority: 'Polícia Federal / Secretaria de Segurança Pública',

  // 4. Experiência com animais
  workedWithDogsBefore: true,
  experienceDuration: '3 a 5 anos',
  workedAsWalkerBefore: true,
  largeDogsExperience: true,
  difficultBehaviorExperience: true,
  multipleDogsExperience: true,

  // 5. Tipos de cães que aceita
  dogSizesAccepted: ['Pequeno', 'Médio', 'Grande'],
  acceptsMultipleDogs: true,
  maxDogsPerWalk: 3,

  // 6. Disponibilidade
  availableDays: [
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
  ],
  startTime: '07:00',
  endTime: '18:00',
  maxWalksPerDay: 5,

  // 7. Região de atendimento
  neighborhoodsServed: 'Jardins, Cerqueira César, Pinheiros, Higienópolis e Bela Vista',
  canTravelToOtherRegions: true,
  transportMethod: 'A pé',

  // 8. Segurança
  comfortableEnteringClientHome: true,
  comfortableWithEmergencies: true,
  hasBasicDogCareKnowledge: true,

  // 9. Apresentação
  aboutMe:
    'Sou apaixonado por cachorros desde a infância. Tenho mais de 3 anos de experiência prática como dog walker e cursos de primeiros socorros caninos e comportamento. Passeio com foco em bem-estar, respeito ao ritmo do pet e estímulos saudáveis.',

  // 10. Documentos para aprovação
  documentsSubmitted: {
    idDocument: true,
    cpf: true,
    residenceProof: true,
    criminalRecord: true,
    profilePhoto: true,
  },
  status: 'Em análise',
};

const SECTIONS = [
  { id: 1, title: 'Dados Pessoais', icon: User },
  { id: 2, title: 'Endereço', icon: MapPin },
  { id: 3, title: 'Antecedentes', icon: Shield },
  { id: 4, title: 'Experiência 🐕', icon: Dog },
  { id: 5, title: 'Portes & Cães', icon: Sparkles },
  { id: 6, title: 'Disponibilidade 📅', icon: Calendar },
  { id: 7, title: 'Região 📍', icon: Compass },
  { id: 8, title: 'Segurança', icon: AlertTriangle },
  { id: 9, title: 'Apresentação', icon: FileText },
  { id: 10, title: 'Documentos & Status', icon: FileCheck },
];

export const BecomeWalker: React.FC<BecomeWalkerProps> = ({
  isOpen,
  onClose,
  onWalkerSubmitted,
  onAddWalkerToPlatform,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<WalkerApplication>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [showPublicPreview, setShowPublicPreview] = useState(false);

  if (!isOpen) return null;

  const toggleDay = (day: string) => {
    if (formData.availableDays.includes(day)) {
      setFormData({
        ...formData,
        availableDays: formData.availableDays.filter((d) => d !== day),
      });
    } else {
      setFormData({
        ...formData,
        availableDays: [...formData.availableDays, day],
      });
    }
  };

  const toggleSize = (size: string) => {
    if (formData.dogSizesAccepted.includes(size)) {
      setFormData({
        ...formData,
        dogSizesAccepted: formData.dogSizesAccepted.filter((s) => s !== size),
      });
    } else {
      setFormData({
        ...formData,
        dogSizesAccepted: [...formData.dogSizesAccepted, size],
      });
    }
  };

  const handleFileUpload = (
    field: 'residenceProofFileName' | 'criminalRecordFileName' | 'photoUrl' | 'identityDocumentFileName',
    defaultName: string
  ) => {
    const fakeFileName = prompt('Digite o nome do arquivo para simular envio:', defaultName);
    if (fakeFileName) {
      if (field === 'photoUrl') {
        setFormData({ ...formData, photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80' });
      } else {
        setFormData({ ...formData, [field]: fakeFileName });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onWalkerSubmitted) {
      onWalkerSubmitted(formData);
    }
    setSubmitted(true);

    // 1. Automatically generate and download PDF of application
    try {
      generateWalkerApplicationPDF(formData);
    } catch (err) {
      console.error('Erro ao gerar PDF do passeador:', err);
    }

    // 2. Automatically open WhatsApp chat with prefilled message to +55 (27) 99666-6164
    try {
      const whatsappMsg = buildWalkerApplicationWhatsAppMessage(formData);
      openWhatsAppChat(whatsappMsg);
    } catch (err) {
      console.error('Erro ao abrir WhatsApp:', err);
    }

    setCurrentStep(10); // go to step 10 to see status and public profile
  };

  // Convert application to a public Walker representation
  const publicWalker: Walker = {
    id: 'walker-' + Date.now(),
    name: formData.fullName || 'João Silva',
    avatarUrl: formData.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    country: formData.country || 'Brasil',
    state: formData.state || 'ES',
    city: formData.city || 'Vitória',
    rating: 4.9,
    reviewsCount: 52,
    experienceYears: formData.experienceDuration.includes('5') ? 5 : formData.experienceDuration.includes('3') ? 3 : 2,
    tags: ['Verificado', 'Primeiros Socorros', 'Passeio Responsivo'],
    pricePerWalk: 45,
    badge: formData.status === 'Passeador aprovado' ? 'Passeador Verificado' : 'Cadastro em Análise',
    bio: formData.aboutMe || 'Passeador parceiro dedicado ao bem-estar e alegria dos cães.',
    coverageArea: formData.neighborhoodsServed || 'Região Central',
    completedWalks: 180,
    availabilityDays: formData.availableDays,
    dogSizesAccepted: formData.dogSizesAccepted as any,
    walkTypes: formData.acceptsMultipleDogs ? ['Individual', 'Em dupla'] : ['Individual exclusivo'],
    specialties: ['Reforço positivo', 'Relatório em tempo real', 'Hidratação controlada'],
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[95vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden relative">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-orange-600 text-white p-5 sm:p-7 shrink-0 relative">
          <button
            id="close-become-walker"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-0.5 rounded-full bg-white/20 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
              <span>🦮</span> Cadastro Oficial
            </span>
            <span className="text-xs text-amber-100 font-semibold">
              Passo {currentStep} de 10: {SECTIONS[currentStep - 1]?.title}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
            Cadastro para ser Passeador
          </h2>
          <p className="text-amber-100 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Faça parte da nossa rede de passeadores verificados. Horários flexíveis, pagamentos pontuais e segurança animal.
          </p>

          {/* Stepper Progress Bar */}
          <div className="mt-4 flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
            {SECTIONS.map((sec) => {
              const Icon = sec.icon;
              const isPassed = currentStep > sec.id;
              const isCurrent = currentStep === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setCurrentStep(sec.id)}
                  title={`${sec.id}. ${sec.title}`}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isCurrent
                      ? 'bg-white text-amber-800 shadow-md scale-105'
                      : isPassed
                      ? 'bg-amber-800/60 text-white hover:bg-amber-800'
                      : 'bg-white/15 text-amber-200 hover:bg-white/25'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">{sec.id}. {sec.title}</span>
                  <span className="md:hidden">{sec.id}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-8 overflow-y-auto flex-1 space-y-6 bg-stone-50/50">
          
          {/* STEP 1: DADOS PESSOAIS */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-center gap-2 pb-2 border-b border-stone-200">
                <User className="w-5 h-5 text-amber-700" />
                <h3 className="text-lg font-black text-stone-900">1. Dados Pessoais</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-bold text-stone-700">Nome completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex.: João Silva dos Santos"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-stone-700">Data de nascimento *</label>
                  <input
                    type="date"
                    required
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-stone-700">CPF *</label>
                  <input
                    type="text"
                    required
                    placeholder="000.000.000-00"
                    value={formData.cpf}
                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-stone-700">Telefone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="(11) 98765-4321"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-stone-700">E-mail *</label>
                  <input
                    type="email"
                    required
                    placeholder="joao@exemplo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                </div>

                {/* Foto de perfil */}
                <div className="sm:col-span-2 p-4 bg-white rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-center gap-4">
                  <img
                    src={formData.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt="Foto de perfil"
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-200 shadow-sm"
                  />
                  <div className="space-y-1 text-center sm:text-left flex-1">
                    <span className="font-bold text-stone-900 block">Foto de perfil</span>
                    <p className="text-xs text-stone-500">
                      Uma foto nítida e sorridente gera 80% mais confiança nos tutores.
                    </p>
                    <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                      <button
                        type="button"
                        onClick={() => handleFileUpload('photoUrl', 'foto_joao.jpg')}
                        className="px-4 py-1.5 rounded-xl text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 cursor-pointer flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        + Adicionar / Alterar Foto
                      </button>
                    </div>
                  </div>
                </div>

                {/* 🛡️ LGPD: Documento de Identidade Oficial (RG ou CNH) */}
                <div className="sm:col-span-2 p-5 bg-white rounded-2xl border-2 border-dashed border-stone-300 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-stone-900 font-bold">
                      <FileText className="w-5 h-5 text-amber-700" />
                      <span>🪪 Documento de Identidade Oficial (RG ou CNH) *</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#047857] border border-emerald-200">
                      Upload Criptografado
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    Obrigatório para ativação da conta. <strong>Base Legal (LGPD Art. 7º, V):</strong> Execução de Contrato de prestação de serviços. Formatos aceitos: <strong>PDF, JPG ou PNG</strong>.
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#047857]" />
                      <span className="text-xs font-semibold text-stone-800">
                        {formData.identityDocumentFileName || 'Nenhum documento anexado'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleFileUpload('identityDocumentFileName', 'rg_cnh_identificacao.pdf')}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>+ Enviar RG ou CNH</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-amber-800 bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/60">
                    🔒 <strong>Segurança e Privacidade:</strong> Nunca envie fotos de documentos de identificação em conversas ou chats abertos. Utilize exclusivamente este canal de upload seguro.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: ENDEREÇO */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-center gap-2 pb-2 border-b border-stone-200">
                <MapPin className="w-5 h-5 text-amber-700" />
                <h3 className="text-lg font-black text-stone-900">2. Endereço onde reside</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
                <div className="space-y-1.5">
                  <label className="font-bold text-stone-700">CEP *</label>
                  <input
                    type="text"
                    required
                    placeholder="01414-001"
                    value={formData.cep}
                    onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-bold text-stone-700">Rua / Logradouro *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex.: Rua Bela Cintra"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-stone-700">Número *</label>
                  <input
                    type="text"
                    required
                    placeholder="1200"
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-stone-700">Complemento</label>
                  <input
                    type="text"
                    placeholder="Apto, bloco, etc."
                    value={formData.complement || ''}
                    onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-stone-700">Bairro *</label>
                  <input
                    type="text"
                    required
                    placeholder="Consolação / Jardins"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-stone-700">País *</label>
                  <select
                    value={formData.country || 'Brasil'}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium cursor-pointer"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-stone-700">Estado *</label>
                  <select
                    value={formData.state || 'ES'}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium cursor-pointer"
                  >
                    {BRAZILIAN_STATES.map((st) => (
                      <option key={st.code} value={st.code}>
                        {st.code} - {st.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-bold text-stone-700">Cidade *</label>
                  <input
                    type="text"
                    required
                    placeholder="Vitória"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                </div>
              </div>

              {/* Comprovante de Residência */}
              <div className="p-5 bg-white rounded-2xl border-2 border-dashed border-stone-300 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-stone-900 font-bold">
                    <FileText className="w-5 h-5 text-amber-700" />
                    <span>📄 Comprovante de residência recente *</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#047857] border border-emerald-200">
                    Upload Criptografado
                  </span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  Envie um comprovante de residência recente (últimos 90 dias). <strong>Base Legal (LGPD Art. 7º, V):</strong> Execução de Contrato para validação cadastral e atendimento presencial. Formatos: <strong>PDF, JPG ou PNG</strong>.
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#047857]" />
                    <span className="text-xs font-semibold text-stone-800">
                      {formData.residenceProofFileName || 'Nenhum arquivo enviado'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleFileUpload('residenceProofFileName', 'comprovante_conta_luz.pdf')}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>+ Enviar comprovante</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CERTIDÃO DE ANTECEDENTES CRIMINAIS */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-center gap-2 pb-2 border-b border-stone-200">
                <Shield className="w-5 h-5 text-amber-700" />
                <h3 className="text-lg font-black text-stone-900">3. Certidão de Antecedentes Criminais</h3>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs sm:text-sm text-amber-900 space-y-2">
                <p className="font-semibold leading-relaxed">
                  Para a proteção dos animais, dos tutores e de toda a comunidade, a apresentação da Certidão de Antecedentes Criminais válida é <strong>obrigatória</strong> para a ativação da conta de passeador.
                </p>
                <div className="text-xs space-y-1 text-amber-800">
                  <p>
                    ⚖️ <strong>Base Legal Aplicada (LGPD Art. 7º, IX):</strong> Legítimo Interesse para a Segurança da Comunidade e Integridade Física dos Animais.
                  </p>
                  <p>
                    🔒 <strong>Descarte e Exclusão Segura (Art. 16):</strong> Caso o cadastro ou a triagem não sejam aprovados, os arquivos do candidato são eliminados definitivamente de nossos servidores criptografados.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Upload da certidão */}
                <div className="p-5 bg-white rounded-2xl border-2 border-dashed border-stone-300 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-700 block">Documento da Certidão *</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#047857] border border-emerald-200">
                      Upload Criptografado
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#047857]" />
                      <span className="text-xs font-semibold text-stone-800">
                        {formData.criminalRecordFileName || 'Nenhuma certidão anexada'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleFileUpload('criminalRecordFileName', 'certidao_antecedentes_policia_federal.pdf')}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>+ Enviar certidão</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div className="space-y-1.5">
                    <label className="font-bold text-stone-700">Data de emissão *</label>
                    <input
                      type="date"
                      required
                      value={formData.criminalRecordIssueDate}
                      onChange={(e) => setFormData({ ...formData, criminalRecordIssueDate: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-stone-700">Órgão emissor *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex.: Polícia Federal ou Secretaria de Segurança Pública"
                      value={formData.criminalRecordIssuingAuthority}
                      onChange={(e) => setFormData({ ...formData, criminalRecordIssuingAuthority: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: EXPERIÊNCIA COM ANIMAIS */}
          {currentStep === 4 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-center gap-2 pb-2 border-b border-stone-200">
                <Dog className="w-5 h-5 text-amber-700" />
                <h3 className="text-lg font-black text-stone-900">4. Experiência com animais 🐕</h3>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                {/* Pergunta 1 */}
                <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-2">
                  <label className="font-bold text-stone-800 block">
                    Você já trabalhou ou cuidou de cães anteriormente?
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-700">
                      <input
                        type="radio"
                        name="workedWithDogsBefore"
                        checked={formData.workedWithDogsBefore === true}
                        onChange={() => setFormData({ ...formData, workedWithDogsBefore: true })}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <span>Sim</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-700">
                      <input
                        type="radio"
                        name="workedWithDogsBefore"
                        checked={formData.workedWithDogsBefore === false}
                        onChange={() => setFormData({ ...formData, workedWithDogsBefore: false })}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <span>Não</span>
                    </label>
                  </div>
                </div>

                {/* Pergunta 2 */}
                <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-2">
                  <label className="font-bold text-stone-800 block">
                    Há quanto tempo você tem experiência com cães?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['Menos de 1 ano', '1 a 2 anos', '3 a 5 anos', 'Mais de 5 anos'].map((exp) => (
                      <button
                        key={exp}
                        type="button"
                        onClick={() => setFormData({ ...formData, experienceDuration: exp })}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                          formData.experienceDuration === exp
                            ? 'bg-amber-50 border-amber-600 text-amber-800 shadow-xs'
                            : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        {exp}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pergunta 3 */}
                <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-2">
                  <label className="font-bold text-stone-800 block">
                    Você já trabalhou como passeador anteriormente?
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-700">
                      <input
                        type="radio"
                        name="workedAsWalkerBefore"
                        checked={formData.workedAsWalkerBefore === true}
                        onChange={() => setFormData({ ...formData, workedAsWalkerBefore: true })}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <span>Sim</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-700">
                      <input
                        type="radio"
                        name="workedAsWalkerBefore"
                        checked={formData.workedAsWalkerBefore === false}
                        onChange={() => setFormData({ ...formData, workedAsWalkerBefore: false })}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <span>Não</span>
                    </label>
                  </div>
                </div>

                {/* Pergunta 4: Grande Porte */}
                <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-2">
                  <label className="font-bold text-stone-800 block">
                    Possui experiência com cães de grande porte?
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-700">
                      <input
                        type="radio"
                        name="largeDogsExperience"
                        checked={formData.largeDogsExperience === true}
                        onChange={() => setFormData({ ...formData, largeDogsExperience: true })}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <span>Sim</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-700">
                      <input
                        type="radio"
                        name="largeDogsExperience"
                        checked={formData.largeDogsExperience === false}
                        onChange={() => setFormData({ ...formData, largeDogsExperience: false })}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <span>Não</span>
                    </label>
                  </div>
                </div>

                {/* Pergunta 5: Comportamento Difícil */}
                <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-2">
                  <label className="font-bold text-stone-800 block">
                    Possui experiência com cães que apresentam comportamento difícil?
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-700">
                      <input
                        type="radio"
                        name="difficultBehaviorExperience"
                        checked={formData.difficultBehaviorExperience === true}
                        onChange={() => setFormData({ ...formData, difficultBehaviorExperience: true })}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <span>Sim</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-700">
                      <input
                        type="radio"
                        name="difficultBehaviorExperience"
                        checked={formData.difficultBehaviorExperience === false}
                        onChange={() => setFormData({ ...formData, difficultBehaviorExperience: false })}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <span>Não</span>
                    </label>
                  </div>
                </div>

                {/* Pergunta 6: Mais de um cão */}
                <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-2">
                  <label className="font-bold text-stone-800 block">
                    Já trabalhou com mais de um cachorro ao mesmo tempo?
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-700">
                      <input
                        type="radio"
                        name="multipleDogsExperience"
                        checked={formData.multipleDogsExperience === true}
                        onChange={() => setFormData({ ...formData, multipleDogsExperience: true })}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <span>Sim</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-700">
                      <input
                        type="radio"
                        name="multipleDogsExperience"
                        checked={formData.multipleDogsExperience === false}
                        onChange={() => setFormData({ ...formData, multipleDogsExperience: false })}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <span>Não</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: TIPOS DE CÃES QUE ACEITA */}
          {currentStep === 5 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-center gap-2 pb-2 border-b border-stone-200">
                <Sparkles className="w-5 h-5 text-amber-700" />
                <h3 className="text-lg font-black text-stone-900">5. Tipos de cães que aceita</h3>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-3">
                  <label className="font-bold text-stone-800 block">
                    Quais portes você aceita passear? (Marque todos que se aplicam)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { size: 'Pequeno', desc: 'Até 10kg (ex: Shih Tzu, Poodle, Dachshund)' },
                      { size: 'Médio', desc: '10kg a 25kg (ex: Beagle, Cocker, Buldogue)' },
                      { size: 'Grande', desc: 'Mais de 25kg (ex: Golden, Labrador, Pastor)' },
                    ].map((item) => {
                      const isSelected = formData.dogSizesAccepted.includes(item.size);
                      return (
                        <button
                          key={item.size}
                          type="button"
                          onClick={() => toggleSize(item.size)}
                          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-amber-50 border-amber-600 shadow-xs'
                              : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-stone-900">{item.size}</span>
                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center ${
                                isSelected ? 'bg-amber-700 text-white' : 'border border-stone-300'
                              }`}
                            >
                              {isSelected && <Check className="w-3.5 h-3.5" />}
                            </div>
                          </div>
                          <p className="text-[11px] text-stone-500 mt-1 leading-tight">{item.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-3">
                  <label className="font-bold text-stone-800 block">
                    Você aceita passear com mais de um cachorro ao mesmo tempo?
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-700">
                      <input
                        type="radio"
                        name="acceptsMultipleDogs"
                        checked={formData.acceptsMultipleDogs === true}
                        onChange={() => setFormData({ ...formData, acceptsMultipleDogs: true })}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <span>Sim</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-700">
                      <input
                        type="radio"
                        name="acceptsMultipleDogs"
                        checked={formData.acceptsMultipleDogs === false}
                        onChange={() => setFormData({ ...formData, acceptsMultipleDogs: false })}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <span>Não (Apenas passeios individuais)</span>
                    </label>
                  </div>
                </div>

                {formData.acceptsMultipleDogs && (
                  <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-2">
                    <label className="font-bold text-stone-800 block">
                      Quantidade máxima de cães por passeio:
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min={1}
                        max={6}
                        value={formData.maxDogsPerWalk}
                        onChange={(e) => setFormData({ ...formData, maxDogsPerWalk: Number(e.target.value) })}
                        className="w-24 px-4 py-2.5 rounded-xl border border-stone-200 text-stone-900 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <span className="text-xs text-stone-500">cães por saída</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 6: DISPONIBILIDADE */}
          {currentStep === 6 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-center gap-2 pb-2 border-b border-stone-200">
                <Calendar className="w-5 h-5 text-amber-700" />
                <h3 className="text-lg font-black text-stone-900">6. Disponibilidade 📅</h3>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-3">
                  <label className="font-bold text-stone-800 block">
                    Quais dias você pode realizar passeios?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {DAYS_OF_WEEK.map((day) => {
                      const isSelected = formData.availableDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(day)}
                          className={`p-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                            isSelected
                              ? 'bg-amber-700 border-amber-700 text-white shadow-xs'
                              : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-3">
                  <label className="font-bold text-stone-800 block">Quais horários?</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-stone-500 font-semibold text-xs">Início:</span>
                      <input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-stone-500 font-semibold text-xs">Fim:</span>
                      <input
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-2">
                  <label className="font-bold text-stone-800 block">
                    Quantos passeios você consegue realizar por dia?
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={formData.maxWalksPerDay}
                      onChange={(e) => setFormData({ ...formData, maxWalksPerDay: Number(e.target.value) })}
                      className="w-24 px-4 py-2.5 rounded-xl border border-stone-200 text-stone-900 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <span className="text-xs text-stone-500">passeios por dia</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: REGIÃO DE ATENDIMENTO */}
          {currentStep === 7 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-center gap-2 pb-2 border-b border-stone-200">
                <Compass className="w-5 h-5 text-amber-700" />
                <h3 className="text-lg font-black text-stone-900">7. Região de atendimento 📍</h3>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="space-y-1.5">
                  <label className="font-bold text-stone-700">
                    Quais bairros ou regiões você atende? *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex.: Jardins, Pinheiros, Higienópolis, Perdizes"
                    value={formData.neighborhoodsServed}
                    onChange={(e) => setFormData({ ...formData, neighborhoodsServed: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                </div>

                <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-2">
                  <label className="font-bold text-stone-800 block">
                    Você consegue se deslocar para outras regiões?
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-700">
                      <input
                        type="radio"
                        name="canTravelToOtherRegions"
                        checked={formData.canTravelToOtherRegions === true}
                        onChange={() => setFormData({ ...formData, canTravelToOtherRegions: true })}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <span>Sim</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-700">
                      <input
                        type="radio"
                        name="canTravelToOtherRegions"
                        checked={formData.canTravelToOtherRegions === false}
                        onChange={() => setFormData({ ...formData, canTravelToOtherRegions: false })}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <span>Não</span>
                    </label>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-3">
                  <label className="font-bold text-stone-800 block">
                    Como você normalmente se desloca?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {['A pé', 'Bicicleta', 'Moto', 'Carro', 'Transporte público', 'Outro'].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setFormData({ ...formData, transportMethod: m })}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                          formData.transportMethod === m
                            ? 'bg-amber-50 border-amber-600 text-amber-800 shadow-xs'
                            : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 8: SEGURANÇA */}
          {currentStep === 8 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-center gap-2 pb-2 border-b border-stone-200">
                <AlertTriangle className="w-5 h-5 text-amber-700" />
                <h3 className="text-lg font-black text-stone-900">8. Segurança e Procedimentos</h3>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-2">
                  <label className="font-bold text-stone-800 block">
                    Você se sente confortável em entrar na residência do cliente para buscar ou devolver o cachorro?
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-700">
                      <input
                        type="radio"
                        name="comfortableEnteringClientHome"
                        checked={formData.comfortableEnteringClientHome === true}
                        onChange={() => setFormData({ ...formData, comfortableEnteringClientHome: true })}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <span>Sim</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-700">
                      <input
                        type="radio"
                        name="comfortableEnteringClientHome"
                        checked={formData.comfortableEnteringClientHome === false}
                        onChange={() => setFormData({ ...formData, comfortableEnteringClientHome: false })}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <span>Não</span>
                    </label>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-2">
                  <label className="font-bold text-stone-800 block">
                    Você se sente confortável em lidar com situações de emergência durante um passeio?
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-700">
                      <input
                        type="radio"
                        name="comfortableWithEmergencies"
                        checked={formData.comfortableWithEmergencies === true}
                        onChange={() => setFormData({ ...formData, comfortableWithEmergencies: true })}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <span>Sim</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-700">
                      <input
                        type="radio"
                        name="comfortableWithEmergencies"
                        checked={formData.comfortableWithEmergencies === false}
                        onChange={() => setFormData({ ...formData, comfortableWithEmergencies: false })}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <span>Não</span>
                    </label>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-2">
                  <label className="font-bold text-stone-800 block">
                    Você possui conhecimento básico sobre cuidados com cães?
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-700">
                      <input
                        type="radio"
                        name="hasBasicDogCareKnowledge"
                        checked={formData.hasBasicDogCareKnowledge === true}
                        onChange={() => setFormData({ ...formData, hasBasicDogCareKnowledge: true })}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <span>Sim</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-700">
                      <input
                        type="radio"
                        name="hasBasicDogCareKnowledge"
                        checked={formData.hasBasicDogCareKnowledge === false}
                        onChange={() => setFormData({ ...formData, hasBasicDogCareKnowledge: false })}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <span>Não</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 9: APRESENTAÇÃO */}
          {currentStep === 9 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-center gap-2 pb-2 border-b border-stone-200">
                <FileText className="w-5 h-5 text-amber-700" />
                <h3 className="text-lg font-black text-stone-900">9. Apresentação</h3>
              </div>

              <div className="space-y-2">
                <label className="font-bold text-stone-800 text-xs sm:text-sm block">
                  Conte um pouco sobre você e sua experiência com cães:
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="Fale sobre seu amor por animais, cursos que realizou, rotina de passeios, cuidados especiais que costuma tomar e por que os tutores podem confiar em você..."
                  value={formData.aboutMe}
                  onChange={(e) => setFormData({ ...formData, aboutMe: e.target.value })}
                  className="w-full p-4 rounded-2xl border border-stone-200 bg-white text-stone-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium leading-relaxed"
                />
                <p className="text-xs text-stone-500">
                  Essa biografia será exibida no seu perfil público após a validação dos documentos.
                </p>
              </div>
            </div>
          )}

          {/* STEP 10: DOCUMENTOS PARA APROVAÇÃO & STATUS DO CADASTRO */}
          {currentStep === 10 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center gap-2 pb-2 border-b border-stone-200">
                <FileCheck className="w-5 h-5 text-amber-700" />
                <h3 className="text-lg font-black text-stone-900">10. Documentos para Aprovação 📄</h3>
              </div>

              {/* Checklist de Documentos Necessários */}
              <div className="p-5 bg-white rounded-2xl border border-stone-200 space-y-3">
                <span className="font-black text-stone-900 text-sm block">Documentos necessários:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>☑ Documento de identificação (RG / CNH)</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>☑ CPF</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>☑ Comprovante de residência</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>☑ Certidão de antecedentes criminais</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 sm:col-span-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>☑ Foto de perfil</span>
                  </div>
                </div>
              </div>

              {/* Status do Cadastro - Selecionador interativo para teste */}
              <div className="p-5 bg-white rounded-2xl border border-stone-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="font-black text-stone-900 text-sm">Status do cadastro:</span>
                  <span className="text-xs text-stone-500">
                    (Simule abaixo os estados de verificação da equipe)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: 'Em análise' })}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all text-left flex items-center gap-2 cursor-pointer ${
                      formData.status === 'Em análise'
                        ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-400'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span className="text-base">🟡</span>
                    <div>
                      <span className="block font-black">Em análise</span>
                      <span className="text-[10px] text-stone-500">Equipe verificando</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: 'Passeador aprovado' })}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all text-left flex items-center gap-2 cursor-pointer ${
                      formData.status === 'Passeador aprovado'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-400'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span className="text-base">🟢</span>
                    <div>
                      <span className="block font-black">Passeador aprovado</span>
                      <span className="text-[10px] text-emerald-700">Verificado com sucesso</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: 'Cadastro pendente' })}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all text-left flex items-center gap-2 cursor-pointer ${
                      formData.status === 'Cadastro pendente'
                        ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-400'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span className="text-base">🔴</span>
                    <div>
                      <span className="block font-black">Cadastro pendente</span>
                      <span className="text-[10px] text-rose-700">Atualizar documento</span>
                    </div>
                  </button>
                </div>

                {/* Descrição do status atual */}
                {formData.status === 'Em análise' && (
                  <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                    <span>🟡</span>
                    <span>
                      <strong>Cadastro Em Análise:</strong> Os documentos foram recebidos e estão sob revisão pela equipe de segurança. Prazo médio: 24 horas.
                    </span>
                  </div>
                )}

                {formData.status === 'Passeador aprovado' && (
                  <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                    <span>🟢</span>
                    <span>
                      <strong>Passeador Aprovado!</strong> Seus documentos foram validados e o selo <strong>Passeador Verificado</strong> foi liberado para receber agendamentos.
                    </span>
                  </div>
                )}

                {formData.status === 'Cadastro pendente' && (
                  <div className="p-3.5 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-900 flex items-center gap-2">
                    <span>🔴</span>
                    <span>
                      <strong>Cadastro pendente:</strong> Necessário enviar/atualizar documento legível de comprovante ou certidão com menos de 90 dias.
                    </span>
                  </div>
                )}
              </div>

              {/* 📲 INTEGRAÇÃO PDF E WHATSAPP (+55 27 99666-6164) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100/50 border-2 border-emerald-300 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📄</span>
                      <h4 className="text-sm sm:text-base font-black text-emerald-950">
                        PDF Oficial Gerado & Enviado para WhatsApp
                      </h4>
                    </div>
                    <p className="text-xs text-emerald-800">
                      Sua ficha completa de passeador foi convertida em PDF e encaminhada ao WhatsApp da central Mundo do Passeio: <strong>{WHATSAPP_TARGET_NUMBER}</strong>.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => generateWalkerApplicationPDF(formData)}
                      className="px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 border border-emerald-300 text-emerald-900 font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Baixar PDF</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const msg = buildWalkerApplicationWhatsAppMessage(formData);
                        openWhatsAppChat(msg);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Abrir no WhatsApp</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* ⭐ PERFIL PÚBLICO DO PASSEADOR */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">⭐</span>
                    <h4 className="font-black text-stone-900 text-sm">Perfil público do passeador</h4>
                  </div>
                  <span className="text-xs text-stone-500">
                    O que os clientes tutores verão na plataforma
                  </span>
                </div>

                {/* Card de Visualização Pública */}
                <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-md space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={publicWalker.avatarUrl}
                        alt={publicWalker.name}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-black text-stone-900">
                            🐾 {publicWalker.name}
                          </h4>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-emerald-800 font-semibold mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                          <span>
                            {publicWalker.city}, {publicWalker.state} • {publicWalker.country}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-stone-600 mt-0.5">
                          <span className="text-amber-500 font-bold flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                            {publicWalker.rating.toFixed(1)}
                          </span>
                          <span>— {publicWalker.reviewsCount} avaliações</span>
                        </div>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1 shrink-0">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>🟢 Passeador verificado</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs py-2 border-y border-stone-100">
                    <div>
                      <span className="text-stone-400 block font-semibold text-[11px]">Experiência:</span>
                      <span className="font-bold text-stone-900">{publicWalker.experienceYears} anos</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block font-semibold text-[11px]">Atende:</span>
                      <span className="font-bold text-stone-900">
                        {formData.dogSizesAccepted.join(' • ') || 'Pequeno • Médio'}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-400 block font-semibold text-[11px]">Disponibilidade:</span>
                      <span className="font-bold text-stone-900">
                        {formData.availableDays.length >= 6 ? 'Seg–Sáb' : `${formData.availableDays.length} dias/sem`}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-400 block font-semibold text-[11px]">Passeios realizados:</span>
                      <span className="font-bold text-stone-900">{publicWalker.completedWalks}</span>
                    </div>
                  </div>

                  <div className="text-xs text-stone-600">
                    <span className="font-bold text-stone-800">Região: </span>
                    <span>{formData.neighborhoodsServed || 'Consolação, Jardins e Pinheiros'}</span>
                  </div>

                  {formData.aboutMe && (
                    <p className="text-xs text-stone-600 italic line-clamp-2">
                      "{formData.aboutMe}"
                    </p>
                  )}

                  {/* Actions buttons */}
                  <div className="pt-2 flex items-center justify-between border-t border-stone-100 text-xs">
                    <button
                      type="button"
                      onClick={() => alert(`Visualizando perfil completo de ${publicWalker.name}`)}
                      className="text-stone-700 hover:text-stone-900 font-bold underline cursor-pointer"
                    >
                      Ver perfil
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (onAddWalkerToPlatform) {
                          onAddWalkerToPlatform(publicWalker);
                        }
                        alert(`Passeador ${publicWalker.name} habilitado para agendamentos!`);
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Agendar passeio</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Navigation Bar */}
        <div className="p-4 sm:p-5 bg-white border-t border-stone-200 flex items-center justify-between gap-3 shrink-0">
          <div>
            {currentStep > 1 && (
              <button
                id="btn-walker-prev"
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-100 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {currentStep < 10 ? (
              <button
                id="btn-walker-next"
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-6 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              >
                <span>Avançar para {SECTIONS[currentStep]?.title || 'Próximo'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                id="btn-walker-finalize"
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors shadow-md cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Salvar e Concluir Cadastro</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
