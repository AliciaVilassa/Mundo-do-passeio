import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  FileText,
  UserCheck,
  Eye,
  Trash2,
  Download,
  CheckCircle2,
  AlertTriangle,
  Send,
  HelpCircle,
  X,
  Sparkles,
  ExternalLink,
  Info,
  RefreshCw,
} from 'lucide-react';
import { DogProfile, WalkerApplication } from '../types';

interface PrivacyLGPDModalProps {
  isOpen: boolean;
  onClose: () => void;
  dogProfile: DogProfile;
  onUpdateDogProfile: (updated: DogProfile) => void;
}

export const PrivacyLGPDModal: React.FC<PrivacyLGPDModalProps> = ({
  isOpen,
  onClose,
  dogProfile,
  onUpdateDogProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'rights' | 'bases' | 'copilot'>('rights');

  // Consentimento de Fotos do Pet (Marketing)
  const [marketingConsent, setMarketingConsent] = useState<boolean>(
    Boolean(dogProfile.marketingPhotosConsent)
  );
  const [consentSavedNotice, setConsentSavedNotice] = useState<string | null>(null);

  // Chat com Copiloto LGPD
  const [chatMessages, setChatMessages] = useState<
    Array<{ id: string; sender: 'user' | 'assistant'; text: string; maskedWarning?: boolean }>
  >([
    {
      id: '1',
      sender: 'assistant',
      text: 'Olá! Sou o seu Copiloto de Privacidade & LGPD do Mundo do Passeio 🐾. Estou aqui para garantir que seus dados e os do seu pet estejam 100% seguros e que seus direitos (Art. 18 da LGPD) sejam respeitados. Como posso te ajudar hoje?',
    },
  ]);
  const [userInput, setUserInput] = useState('');
  const [isDeletingData, setIsDeletingData] = useState(false);
  const [dataDeletedNotice, setDataDeletedNotice] = useState(false);

  if (!isOpen) return null;

  // Função para mascarar CPFs, RGs ou dados sensíveis que o usuário possa digitar espontaneamente
  const sanitizeUserInput = (text: string): { sanitized: string; hadSensitive: boolean } => {
    let hadSensitive = false;

    // Detectar CPF (com ou sem pontuação: 11 dígitos)
    const cpfRegex = /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g;
    if (cpfRegex.test(text)) {
      hadSensitive = true;
      text = text.replace(cpfRegex, '***.***.***-** [DADO RESTRITO]');
    }

    // Detectar RG simples (7 a 9 dígitos)
    const rgRegex = /\b\d{1,2}\.?\d{3}\.?\d{3}-?[\dX]\b/gi;
    if (rgRegex.test(text)) {
      hadSensitive = true;
      text = text.replace(rgRegex, '**RG-MASCARADO**');
    }

    // Detectar menções a senhas
    const passRegex = /(senha|password)[:=]\s*(\S+)/gi;
    if (passRegex.test(text)) {
      hadSensitive = true;
      text = text.replace(passRegex, '$1: ********');
    }

    return { sanitized: text, hadSensitive };
  };

  const handleSendMessage = (customQuery?: string) => {
    const rawQuery = customQuery || userInput;
    if (!rawQuery.trim()) return;

    const { sanitized, hadSensitive } = sanitizeUserInput(rawQuery);

    const userMsgId = Date.now().toString();
    const newUserMsg = {
      id: userMsgId,
      sender: 'user' as const,
      text: sanitized,
      maskedWarning: hadSensitive,
    };

    setChatMessages((prev) => [...prev, newUserMsg]);
    if (!customQuery) setUserInput('');

    // Gerar resposta inteligente do Copiloto LGPD
    setTimeout(() => {
      let botResponse = '';
      const lower = rawQuery.toLowerCase();

      if (hadSensitive) {
        botResponse =
          '⚠️ Notei que você incluiu um dado pessoal restrito (como CPF ou documento). Por diretrizes de Minimização de Dados e Segurança da LGPD, mascarei essa informação. Lembre-se: nunca envie documentos pessoais em chats abertos; utilize exclusivamente os campos de upload criptografados do sistema!';
      } else if (lower.includes('foto') || lower.includes('imagem') || lower.includes('marketing') || lower.includes('redes sociais')) {
        botResponse =
          '📸 Conforme o Artigo 18 da LGPD e nosso compromisso de privacidade, a divulgação de fotos do seu pet para fins de marketing exige o seu Consentimento Explícito e Destacado (sem caixas pré-marcadas). Você pode revogar essa permissão a qualquer momento na aba "Meus Direitos & Dados" deste painel. Se revogado, garantimos que as fotos serão imediatamente removidas do nosso site e canais!';
      } else if (lower.includes('documento') || lower.includes('passeador') || lower.includes('antecedente') || lower.includes('ativar')) {
        botResponse =
          '🛡️ Para a segurança dos pets e de toda a comunidade, todo candidato a Passeador deve enviar obrigatoriamente: (1) Documento de identidade civil (RG/CNH), (2) Comprovante de residência recente e (3) Atestado de Bons Antecedentes Criminais válido. As bases legais são a Execução de Contrato (documentos civis) e o Legítimo Interesse para Segurança da Comunidade (antecedentes criminais). Todos os arquivos devem ser enviados pelo campo de upload criptografado e dados de triagens não aprovadas são excluídos permanentemente de nossos servidores.';
      } else if (lower.includes('excluir') || lower.includes('apagar') || lower.includes('eliminar') || lower.includes('deletar')) {
        botResponse =
          '🗑️ Pelo Artigo 18, inciso VI da LGPD, você tem o direito garantido de solicitar a eliminação definitiva de seus dados cadastrais a qualquer momento. Você pode acionar a exclusão direta na aba "Meus Direitos & Dados" ou enviar um e-mail para mundodopasseio@gmail.com.';
      } else if (lower.includes('base legal') || lower.includes('lei') || lower.includes('finalidade')) {
        botResponse =
          '⚖️ No Mundo do Passeio utilizamos 3 bases legais claras:\n1. Execução de Contrato: para agendar o passeio e conectar você ao passeador;\n2. Legítimo Interesse: para checagem de antecedentes do passeador e rastreamento GPS ao vivo;\n3. Consentimento: para autorização de fotos do pet em redes sociais e marketing (opcional e revogável). Não realizamos venda de dados nem tratamos dados sensíveis humanos.';
      } else if (lower.includes('exportar') || lower.includes('portabilidade') || lower.includes('baixar')) {
        botResponse =
          '📦 Você pode solicitar a portabilidade dos seus dados (Art. 18, V) clicando no botão "Exportar Meus Dados em JSON" na aba "Meus Direitos & Dados". Um arquivo estruturado e legível será baixado instantaneamente no seu dispositivo.';
      } else {
        botResponse =
          'Entendi sua dúvida! No Mundo do Passeio, seguimos a LGPD com o princípio de "Privacy by Design": minimizamos a coleta de dados, protegemos seus documentos com criptografia e você tem total controle sobre consentimentos e exclusão. Caso queira falar diretamente com nosso Encarregado de Dados (DPO), envie mensagem para mundodopasseio@gmail.com ou pelo WhatsApp +55 (27) 99666-6164.';
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: botResponse,
        },
      ]);
    }, 450);
  };

  const handleToggleMarketingConsent = (newVal: boolean) => {
    setMarketingConsent(newVal);
    onUpdateDogProfile({
      ...dogProfile,
      marketingPhotosConsent: newVal,
    });
    setConsentSavedNotice(
      newVal
        ? 'Consentimento de fotos registrado com sucesso! Você pode revogar a qualquer momento.'
        : 'Consentimento de fotos REVOGADO com sucesso. Fotos do seu pet não serão veiculadas e as existentes serão retiradas de circulação (Art. 18, IX).'
    );
    setTimeout(() => setConsentSavedNotice(null), 5000);
  };

  const handleExportData = () => {
    const exportPayload = {
      title: 'Relatório de Portabilidade de Dados - Mundo do Passeio (Art. 18, V LGPD)',
      generatedAt: new Date().toISOString(),
      dogTutorProfile: {
        petName: dogProfile.name,
        breed: dogProfile.breed,
        age: dogProfile.age,
        size: dogProfile.size,
        city: dogProfile.city,
        state: dogProfile.state,
        country: dogProfile.country,
        marketingPhotosConsent: dogProfile.marketingPhotosConsent ?? false,
        allergies: dogProfile.allergyDetails || 'Nenhuma informada',
        pickupAddress: dogProfile.pickupAddress || 'Não cadastrado',
      },
      dataController: 'Mundo do Passeio Serviços Pet Ltda.',
      dpoContact: 'mundodopasseio@gmail.com | +55 (27) 99666-6164',
      privacyStandard: 'Lei Federal nº 13.709/2018 (LGPD)',
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meus_dados_lgpd_${dogProfile.name || 'pet'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteData = () => {
    if (window.confirm('Tem certeza que deseja solicitar a eliminação dos seus dados da sessão conforme o Artigo 18, VI da LGPD?')) {
      setIsDeletingData(true);
      setTimeout(() => {
        setIsDeletingData(false);
        setDataDeletedNotice(true);
      }, 700);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-stone-100">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-stone-950 flex items-center justify-center font-bold text-xl shadow-md">
              <ShieldCheck className="w-6 h-6 text-emerald-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black tracking-tight">
                  Central de Privacidade & Copiloto LGPD
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-400 text-emerald-950 uppercase">
                  Lei 13.709/18
                </span>
              </div>
              <p className="text-xs text-emerald-200">
                Seus direitos de privacidade garantidos, com transparência e sem juridiquês 🐾
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Fechar Central de Privacidade"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-4 sm:px-6 gap-2 text-xs font-bold shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('rights')}
            className={`py-3 px-3.5 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'rights'
                ? 'border-[#047857] text-[#047857]'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Meus Direitos & Dados (Art. 18)</span>
          </button>

          <button
            onClick={() => setActiveTab('bases')}
            className={`py-3 px-3.5 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'bases'
                ? 'border-[#047857] text-[#047857]'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Bases Legais & Transparência</span>
          </button>

          <button
            onClick={() => setActiveTab('copilot')}
            className={`py-3 px-3.5 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'copilot'
                ? 'border-[#047857] text-[#047857]'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Copiloto de Dúvidas LGPD</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6 text-stone-800 text-sm">
          {/* TAB 1: MEUS DIREITOS E GESTÃO DE DADOS */}
          {activeTab === 'rights' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Resumo e Art. 18 */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <p className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#047857]" />
                  Você é o titular dos seus dados pessoais
                </p>
                <p>
                  Pelo <strong>Artigo 18 da LGPD</strong>, você tem o direito de confirmar a existência de tratamento, acessar seus dados, corrigir erros, exportá-los e revogar consentimentos a qualquer momento com facilidade.
                </p>
              </div>

              {/* Consentimento de Fotos do Pet para Marketing */}
              <div className="p-5 rounded-2xl bg-white border-2 border-stone-200 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="font-black text-stone-900 text-sm flex items-center gap-2">
                      <span>📸 Divulgação de Fotos do Pet em Passeios (Marketing)</span>
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Conforme a LGPD, o uso da imagem do seu pet para divulgação em nossas redes sociais exige o seu consentimento livre e explícito.
                    </p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                    <input
                      type="checkbox"
                      checked={marketingConsent}
                      onChange={(e) => handleToggleMarketingConsent(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#047857]"></div>
                  </label>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span
                    className={`font-bold px-2 py-0.5 rounded-md ${
                      marketingConsent
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    Status: {marketingConsent ? 'Autorizado pelo Tutor' : 'Revogado / Não Autorizado'}
                  </span>
                  <span className="text-[11px] text-stone-500">
                    {marketingConsent
                      ? 'Suas fotos podem aparecer com carinho no feed do app.'
                      : 'Nenhuma foto do seu pet é veiculada publicamente.'}
                  </span>
                </div>

                {consentSavedNotice && (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-semibold text-emerald-900 animate-fadeIn">
                    {consentSavedNotice}
                  </div>
                )}
              </div>

              {/* Dados Cadastrados do Titular & Pet */}
              <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-3">
                <h4 className="font-black text-stone-900 text-sm flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#047857]" />
                  <span>Dados do seu Pet cadastrados na plataforma</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                  <div>
                    <span className="text-stone-500 block">Nome do Cão:</span>
                    <strong className="text-stone-900">{dogProfile.name || 'Thor'}</strong>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Raça & Porte:</span>
                    <strong className="text-stone-900">
                      {dogProfile.breed || 'SRD'} ({dogProfile.size || 'Médio'})
                    </strong>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Idade:</span>
                    <strong className="text-stone-900">{dogProfile.age || 3} anos</strong>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Estado / Região:</span>
                    <strong className="text-stone-900">
                      {dogProfile.state || 'ES'} ({dogProfile.country || 'Brasil'})
                    </strong>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Restrições de Saúde:</span>
                    <strong className="text-stone-900">
                      {dogProfile.allergyDetails || 'Nenhuma informada'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Fotos Marketing:</span>
                    <strong className={dogProfile.marketingPhotosConsent ? 'text-emerald-700' : 'text-stone-600'}>
                      {dogProfile.marketingPhotosConsent ? 'Sim (Autorizado)' : 'Não (Revogado)'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Botões de Ação do Titular (Art. 18) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Portabilidade de Dados */}
                <button
                  type="button"
                  onClick={handleExportData}
                  className="p-4 rounded-2xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 flex items-center gap-3 transition-colors cursor-pointer group text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#047857] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-xs block text-stone-900">
                      Portabilidade de Dados (Art. 18, V)
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Baixe um arquivo JSON com todas as suas informações
                    </span>
                  </div>
                </button>

                {/* Solicitar Eliminação de Dados */}
                <button
                  type="button"
                  onClick={handleDeleteData}
                  disabled={isDeletingData || dataDeletedNotice}
                  className="p-4 rounded-2xl bg-white hover:bg-rose-50/50 border border-rose-200 text-stone-800 flex items-center gap-3 transition-colors cursor-pointer group text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-xs block text-rose-900">
                      Eliminação de Dados (Art. 18, VI)
                    </span>
                    <span className="text-[11px] text-rose-600">
                      {dataDeletedNotice ? 'Dados excluídos com sucesso' : 'Excluir definitivamente meus registros'}
                    </span>
                  </div>
                </button>
              </div>

              {dataDeletedNotice && (
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Seus dados de sessão foram expurgados de nossos registros ativos conforme Artigo 18 da LGPD.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: BASES LEGAIS E TRANSPARÊNCIA */}
          {activeTab === 'bases' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="space-y-1">
                <h4 className="font-black text-stone-900 text-base">
                  Por que coletamos dados e qual a base legal?
                </h4>
                <p className="text-xs text-stone-600">
                  No Mundo do Passeio, a privacidade é pensada desde o início (Privacy by Design). Não coletamos dados sensíveis como religião, política ou saúde pessoal. Veja como tratamos cada informação:
                </p>
              </div>

              {/* Cards das 3 bases legais */}
              <div className="space-y-3">
                {/* 1. Execução de Contrato */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 text-xs flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#047857]" />
                      1. Execução de Contrato (Art. 7º, V)
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Obrigatório para o serviço
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    <strong>O que envolve:</strong> Nome do tutor, telefone/WhatsApp para contato, endereço do passeio, características do cão e, para passeadores, documento de identidade civil (RG/CNH) e comprovante de residência.
                  </p>
                  <p className="text-[11px] text-stone-500">
                    <strong>Finalidade:</strong> Viabilizar a realização do passeio, prestar atendimento e garantir a cobrança e o repasse seguro aos parceiros.
                  </p>
                </div>

                {/* 2. Legítimo Interesse (Segurança) */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 text-xs flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-700" />
                      2. Legítimo Interesse para Segurança (Art. 7º, IX)
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                      Proteção da Comunidade
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    <strong>O que envolve:</strong> Certidão de Antecedentes Criminais dos candidatos a passeador e rastreamento GPS em tempo real do percurso do passeio.
                  </p>
                  <p className="text-[11px] text-stone-500">
                    <strong>Finalidade:</strong> Assegurar que os animais e os lares dos tutores fiquem sob custódia de pessoas idôneas e verificadas. Em caso de recusa na triagem, os arquivos são eliminados definitivamente.
                  </p>
                </div>

                {/* 3. Consentimento Explícito */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 text-xs flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-teal-700" />
                      3. Consentimento Livre e Destacado (Art. 7º, I)
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-900">
                      100% Opcional & Revogável
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    <strong>O que envolve:</strong> Uso de fotos e vídeos dos cães durante os passeios em nosso site e redes sociais para mostrar momentos felizes e promover passeadores.
                  </p>
                  <p className="text-[11px] text-stone-500">
                    <strong>Finalidade:</strong> Apenas veiculamos com o seu aceite prévio e não pré-marcado. Você tem o direito de revogar e pedir a exclusão a qualquer hora.
                  </p>
                </div>
              </div>

              {/* Segurança Criptográfica */}
              <div className="p-4 rounded-2xl bg-emerald-950 text-white space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-emerald-300">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>Segurança por Padrão (Privacy by Design)</span>
                </div>
                <p className="text-emerald-100/90 leading-relaxed">
                  Todas as transferências de dados utilizam conexões com criptografia de ponta a ponta (HTTPS/TLS). Documentos de verificação são armazenados em diretórios restritos e nunca são compartilhados em canais abertos de atendimento.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: COPILOTO DE DÚVIDAS LGPD (CHAT INTERATIVO) */}
          {activeTab === 'copilot' && (
            <div className="space-y-4 animate-fadeIn flex flex-col h-[480px]">
              {/* Sugestões de perguntas rápidas */}
              <div className="space-y-1.5 shrink-0">
                <span className="text-[11px] font-bold text-stone-500 block uppercase tracking-wider">
                  Perguntas frequentes sobre privacidade:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleSendMessage('Quais documentos são obrigatórios para ser passeador?')}
                    className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-[11px] font-medium text-stone-700 transition-colors cursor-pointer border border-stone-200"
                  >
                    📋 Documentos do Passeador
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendMessage('Como revogar o uso de fotos do meu cão?')}
                    className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-[11px] font-medium text-stone-700 transition-colors cursor-pointer border border-stone-200"
                  >
                    📸 Revogar fotos de marketing
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendMessage('Como apagar ou exportar meus dados da plataforma?')}
                    className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-[11px] font-medium text-stone-700 transition-colors cursor-pointer border border-stone-200"
                  >
                    🗑️ Excluir ou exportar dados
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendMessage('Posso mandar meus documentos por WhatsApp ou chat aberto?')}
                    className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-[11px] font-medium text-stone-700 transition-colors cursor-pointer border border-stone-200"
                  >
                    🔒 Envio seguro de documentos
                  </button>
                </div>
              </div>

              {/* Área das Mensagens do Chat */}
              <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-stone-50 rounded-2xl border border-stone-200">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-[#047857] text-white rounded-br-none'
                          : 'bg-white text-stone-800 border border-stone-200 rounded-bl-none shadow-xs'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>
                    </div>

                    {msg.maskedWarning && (
                      <span className="text-[10px] text-amber-700 font-bold mt-1">
                        🛡️ Dados pessoais mascarados por segurança.
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Input do Chat */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2 shrink-0"
              >
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Pergunte sobre seus dados, LGPD, exclusão ou documentos..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-xs text-stone-900 focus:outline-none focus:border-[#047857] focus:ring-1 focus:ring-[#047857]"
                />
                <button
                  type="submit"
                  disabled={!userInput.trim()}
                  className="px-4 py-2.5 rounded-xl bg-[#047857] hover:bg-[#065F46] disabled:bg-stone-300 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Perguntar</span>
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600 shrink-0">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#047857]" />
            <span>
              Encarregado de Dados (DPO): <strong>mundodopasseio@gmail.com</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs cursor-pointer transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
