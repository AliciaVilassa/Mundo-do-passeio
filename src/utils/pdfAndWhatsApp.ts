import jsPDF from 'jspdf';
import { DogProfile, WalkerApplication } from '../types';

export const WHATSAPP_TARGET_NUMBER = '+55 (27) 99666-6164';
export const WHATSAPP_RAW_PHONE = '5527996666164';

// Helper to open WhatsApp URL with prefilled text
export function openWhatsAppChat(message: string) {
  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${WHATSAPP_RAW_PHONE}?text=${encoded}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Generates a clean PDF for the Dog Questionnaire (Ficha Cadastral do Pet)
 * and automatically triggers download on the client.
 */
export function generateDogQuestionnairePDF(
  dog: DogProfile,
  tutorInfo?: { name?: string; phone?: string; email?: string }
): { doc: jsPDF; fileName: string } {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 16;

  // Header Banner
  doc.setFillColor(4, 120, 87); // #047857 Emerald
  doc.rect(0, 0, pageWidth, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('MUNDO DO PASSEIO — FICHA CADASTRAL DO PET', 14, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Central WhatsApp: ${WHATSAPP_TARGET_NUMBER} | Data: ${new Date().toLocaleDateString('pt-BR')}`, 14, 19);

  y = 32;

  function checkPageBreak(neededHeight: number = 15) {
    if (y + neededHeight > 280) {
      doc.addPage();
      y = 18;
    }
  }

  function printSectionTitle(title: string) {
    checkPageBreak(18);
    doc.setFillColor(243, 244, 246);
    doc.rect(14, y, pageWidth - 28, 8, 'F');
    doc.setTextColor(4, 120, 87);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(title, 17, y + 5.5);
    y += 12;
  }

  function printField(label: string, value: string | number | undefined | null) {
    checkPageBreak(9);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(55, 65, 81);
    doc.text(`${label}:`, 16, y);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(17, 24, 39);
    const displayValue = value !== undefined && value !== null && String(value).trim() !== '' ? String(value) : 'Não informado';
    
    // Split text if it is long
    const textLines = doc.splitTextToSize(displayValue, pageWidth - 80);
    doc.text(textLines, 70, y);
    y += Math.max(6, textLines.length * 4.5 + 2);
  }

  // 1. Identificação do Tutor & Localização
  printSectionTitle('1. LOCALIZAÇÃO E DADOS DO TUTOR');
  printField('País', dog.country || 'Brasil');
  printField('Estado / Região', dog.state || 'ES (Espírito Santo)');
  printField('Cidade / Bairro', dog.city || 'Vitória / Região');
  printField('Nome do Tutor', tutorInfo?.name || 'Tutor Cadastrado');
  printField('WhatsApp / Telefone', tutorInfo?.phone || WHATSAPP_TARGET_NUMBER);
  printField('E-mail do Tutor', tutorInfo?.email || 'mundodopasseio@gmail.com');
  printField('Endereço de Saída', dog.pickupAddress || 'Endereço fornecido pelo tutor');
  if (dog.referencePoint) printField('Ponto de Referência', dog.referencePoint);

  // 2. Informações Básicas do Cão
  printSectionTitle('2. INFORMAÇÕES BÁSICAS DO CÃO');
  printField('Nome do Cão', dog.name);
  printField('Raça', dog.breed);
  printField('Idade', `${dog.age} anos`);
  printField('Porte', dog.size);
  printField('Sexo', dog.gender);
  printField('Castrado(a)?', dog.neutered ? 'Sim' : 'Não');

  // 3. Personalidade e Convivência
  printSectionTitle('3. PERSONALIDADE E CONVIVÊNCIA');
  printField('Traços de Personalidade', (dog.personalityTraits || []).join(', ') || 'Não especificado');
  if (dog.personalityOther) printField('Outros Traços', dog.personalityOther);
  printField('Reação a Estranhos', dog.strangerReaction);
  printField('Reação a Outros Cães', dog.dogReaction);

  // 4. Comportamento Durante o Passeio
  printSectionTitle('4. COMPORTAMENTO DURANTE O PASSEIO');
  printField('Puxa a guia?', dog.pullsLeash);
  printField('Tenta escapar da guia?', dog.escapesLeash);
  printField('Reação a carros/motos/bicicletas', dog.reactionBikesCars);
  printField('Reação a outros animais', dog.reactionOtherAnimals);
  if (dog.walkerNeedsToKnowBehavior) {
    printField('Observações Importantes', dog.walkerNeedsToKnowBehavior);
  }

  // 5. Medos e Cuidados Especiais
  printSectionTitle('5. MEDOS E SITUAÇÕES A EVITAR');
  printField('Medos identificados', (dog.fears || []).join(', ') || 'Nenhum medo crítico relatado');
  if (dog.fearsOther) printField('Outros Medos', dog.fearsOther);
  if (dog.placesSituationsToAvoid) printField('Evitar durante passeio', dog.placesSituationsToAvoid);

  // 6. Saúde e Restrições
  printSectionTitle('6. SAÚDE, ALERGIAS E CUIDADOS ESPECIAIS');
  printField('Possui condição de saúde?', dog.hasHealthInfo ? `Sim (${dog.healthInfoDetails || ''})` : 'Não');
  printField('Possui alergias?', dog.hasAllergies ? `Sim (${dog.allergyDetails || ''})` : 'Não');
  printField('Restrição física/passeio?', dog.hasWalkingRestrictions ? `Sim (${dog.walkingRestrictionsDetails || ''})` : 'Não');
  printField('Cuidados especiais?', dog.hasSpecialCare ? `Sim (${dog.specialCareDetails || ''})` : 'Não');

  // 7. Equipamentos e Recompensas
  printSectionTitle('7. EQUIPAMENTOS E RECOMPENSAS');
  printField('Tipo de Equipamento', dog.equipmentType + (dog.equipmentOther ? ` (${dog.equipmentOther})` : ''));
  if (dog.specialEquipmentNotes) printField('Notas de Equipamento', dog.specialEquipmentNotes);
  printField('Atividades Favoritas', (dog.favoriteActivities || []).join(', '));
  if (dog.makesDogHappy) printField('O que deixa o cão feliz', dog.makesDogHappy);
  printField('Pode receber petiscos?', dog.canReceiveTreats ? 'Sim' : 'Não');
  if (dog.forbiddenFoods) printField('Alimentos proibidos', dog.forbiddenFoods);

  // 8. Termos
  printSectionTitle('8. CONFIRMAÇÃO DE SEGURANÇA E TERMOS');
  printField('Termos de Segurança Aceitos', dog.confirmedSafetyTerms ? 'Sim, confirmado pelo tutor' : 'Pendente');
  printField('Status do Cadastro', 'Ativo — Enviado para Mundo do Passeio');

  // Footer on last page
  checkPageBreak(15);
  y += 4;
  doc.setDrawColor(209, 213, 219);
  doc.line(14, y, pageWidth - 14, y);
  y += 6;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.text(
    `Documento gerado automaticamente por Mundo do Passeio. Envie este arquivo para o WhatsApp: ${WHATSAPP_TARGET_NUMBER}`,
    14,
    y
  );

  const cleanDogName = (dog.name || 'Pet').replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `MundoDoPasseio_Pet_${cleanDogName}.pdf`;

  // Trigger download
  doc.save(fileName);

  return { doc, fileName };
}

/**
 * Generates a clean PDF for the Walker Application (Cadastro de Passeador em 10 Etapas)
 * and automatically triggers download on the client.
 */
export function generateWalkerApplicationPDF(
  walker: WalkerApplication
): { doc: jsPDF; fileName: string } {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 16;

  // Header Banner
  doc.setFillColor(15, 23, 42); // #0F172A Slate dark
  doc.rect(0, 0, pageWidth, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('MUNDO DO PASSEIO — CADASTRO DE PASSEADOR PARCEIRO', 14, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Central de Credenciamento: ${WHATSAPP_TARGET_NUMBER} | Data: ${new Date().toLocaleDateString('pt-BR')}`, 14, 19);

  y = 32;

  function checkPageBreak(neededHeight: number = 15) {
    if (y + neededHeight > 280) {
      doc.addPage();
      y = 18;
    }
  }

  function printSectionTitle(title: string) {
    checkPageBreak(18);
    doc.setFillColor(241, 245, 249);
    doc.rect(14, y, pageWidth - 28, 8, 'F');
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.text(title, 17, y + 5.5);
    y += 12;
  }

  function printField(label: string, value: string | number | undefined | null) {
    checkPageBreak(9);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`${label}:`, 16, y);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    const displayValue = value !== undefined && value !== null && String(value).trim() !== '' ? String(value) : 'Não informado';
    
    const textLines = doc.splitTextToSize(displayValue, pageWidth - 80);
    doc.text(textLines, 72, y);
    y += Math.max(6, textLines.length * 4.5 + 2);
  }

  // 1. Dados Pessoais
  printSectionTitle('1. DADOS PESSOAIS DO CANDIDATO');
  printField('Nome Completo', walker.fullName);
  printField('Data de Nascimento', walker.birthDate);
  printField('CPF', walker.cpf);
  printField('Telefone / WhatsApp', walker.phone);
  printField('E-mail', walker.email);

  // 2. Endereço e Região
  printSectionTitle('2. ENDEREÇO RESIDENCIAL E REGIÃO');
  printField('Estado', walker.state || 'ES');
  printField('Cidade', walker.city || 'Vitória');
  printField('Bairro', walker.neighborhood || 'Centro');
  printField('Endereço Completo', `${walker.street}, nº ${walker.number}${walker.complement ? ' - ' + walker.complement : ''}`);
  printField('CEP', walker.cep);
  printField('Comprovante de Residência', walker.residenceProofFileName || 'Anexado no formulário');

  // 3. Antecedentes Criminais
  printSectionTitle('3. CERTIDÃO DE ANTECEDENTES CRIMINAIS');
  printField('Documento da Certidão', walker.criminalRecordFileName || 'Anexado digitalmente');
  printField('Data de Emissão', walker.criminalRecordIssueDate);
  printField('Órgão Emissor', walker.criminalRecordIssuingAuthority);

  // 4. Experiência com Animais
  printSectionTitle('4. EXPERIÊNCIA COM ANIMAIS');
  printField('Já cuidou/trabalhou com cães?', walker.workedWithDogsBefore ? 'Sim' : 'Não');
  printField('Tempo de Experiência', walker.experienceDuration);
  printField('Já atuou como passeador profissional?', walker.workedAsWalkerBefore ? 'Sim' : 'Não');
  printField('Manejo de cães de grande porte', walker.largeDogsExperience ? 'Sim, experiente' : 'Não');
  printField('Manejo de comportamento desafiador', walker.difficultBehaviorExperience ? 'Sim' : 'Não');
  printField('Experiência com múltiplos cães', walker.multipleDogsExperience ? 'Sim' : 'Não');

  // 5. Tipos de Cães e Modalidades
  printSectionTitle('5. TIPOS DE CÃES QUE ACEITA');
  printField('Portes Aceitos', (walker.dogSizesAccepted || []).join(', '));
  printField('Passeios Múltiplos (Grupo)', walker.acceptsMultipleDogs ? 'Sim' : 'Somente individuais');
  printField('Máximo de Cães por Passeio', `${walker.maxDogsPerWalk || 1} cães`);

  // 6. Disponibilidade
  printSectionTitle('6. DISPONIBILIDADE DE HORÁRIOS');
  printField('Dias Disponíveis', (walker.availableDays || []).join(', '));
  printField('Horário de Atendimento', `Das ${walker.startTime || '07:00'} às ${walker.endTime || '18:00'}`);
  printField('Capacidade Máxima por Dia', `${walker.maxWalksPerDay || 4} passeios/dia`);

  // 7. Região de Atendimento
  printSectionTitle('7. REGIÃO DE ATENDIMENTO');
  printField('Bairros Atendidos', walker.neighborhoodsServed);
  printField('Disponibilidade para Deslocamento', walker.canTravelToOtherRegions ? 'Sim' : 'Não');
  printField('Meio de Transporte Principal', walker.transportMethod);

  // 8. Segurança e Procedimentos
  printSectionTitle('8. SEGURANÇA E PROTOCOLOS');
  printField('Acesso ao Imóvel do Cliente', walker.comfortableEnteringClientHome ? 'Sim, ciente e autorizado' : 'Não');
  printField('Preparo para Emergências', walker.comfortableWithEmergencies ? 'Sim, treinado' : 'Não');
  printField('Noções de Primeiros Socorros Caninos', walker.hasBasicDogCareKnowledge ? 'Sim' : 'Não');

  // 9. Apresentação e Biografia
  printSectionTitle('9. APRESENTAÇÃO E BIOGRAFIA');
  printField('Sobre o Passeador', walker.aboutMe || 'Passeador parceiro dedicado');

  // 10. Status da Análise
  printSectionTitle('10. STATUS DA ANÁLISE DO CADASTRO');
  printField('Status Atual', walker.status);
  printField('Documentos Enviados', 'RG/CNH, CPF, Residência, Antecedentes e Foto de Perfil');
  printField('Destinatário da Validação', `Mundo do Passeio — WhatsApp: ${WHATSAPP_TARGET_NUMBER}`);

  // Footer on last page
  checkPageBreak(15);
  y += 4;
  doc.setDrawColor(203, 213, 225);
  doc.line(14, y, pageWidth - 14, y);
  y += 6;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Documento oficial gerado por Mundo do Passeio. Anexe este PDF na conversa de WhatsApp: ${WHATSAPP_TARGET_NUMBER}`,
    14,
    y
  );

  const cleanName = (walker.fullName || 'Passeador').replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `MundoDoPasseio_Passeador_${cleanName}.pdf`;

  // Trigger download
  doc.save(fileName);

  return { doc, fileName };
}

/**
 * Builds the WhatsApp message for Tutor Dog Registration
 */
export function buildDogRegistrationWhatsAppMessage(
  dog: DogProfile,
  tutorInfo?: { name?: string; phone?: string; email?: string }
): string {
  return `🐕 *NOVO CADASTRO DE PET — MUNDO DO PASSEIO*

📍 *Localização:*
• País: ${dog.country || 'Brasil'}
• Estado: ${dog.state || 'ES (Espírito Santo)'}
• Cidade / Bairro: ${dog.city || 'Região Metropolitana'}
• Endereço de Saída: ${dog.pickupAddress || 'A combinar'}

👤 *Dados do Tutor:*
• Tutor(a): ${tutorInfo?.name || 'Tutor Cadastrado'}
• WhatsApp: ${tutorInfo?.phone || 'Informado'}
• E-mail: ${tutorInfo?.email || 'Informado'}

🐶 *Ficha do Cachorro:*
• Nome: *${dog.name}*
• Raça: ${dog.breed || 'SRD'}
• Idade: ${dog.age} anos | Porte: ${dog.size} | Sexo: ${dog.gender}
• Castrado(a): ${dog.neutered ? 'Sim' : 'Não'}

🐾 *Personalidade e Convivência:*
• Traços: ${(dog.personalityTraits || []).join(', ') || 'Não especificado'}
• Com Estranhos: ${dog.strangerReaction}
• Com Outros Cães: ${dog.dogReaction}

🚶 *Comportamento no Passeio:*
• Puxa guia: ${dog.pullsLeash}
• Tenta escapar: ${dog.escapesLeash}
• Reação a trânsito: ${dog.reactionBikesCars}
• Reação a animais: ${dog.reactionOtherAnimals}
${dog.walkerNeedsToKnowBehavior ? `• Observação: ${dog.walkerNeedsToKnowBehavior}\n` : ''}
⚠️ *Medos & Cuidados:*
• Medos: ${(dog.fears || []).join(', ') || 'Nenhum'}
• Equipamento: ${dog.equipmentType}
• Petiscos: ${dog.canReceiveTreats ? 'Permitido' : 'Não'}

📄 *O PDF completo com todas as respostas foi gerado e salvo automaticamente no meu celular/computador e estou anexando aqui no WhatsApp!*`;
}

/**
 * Builds the WhatsApp message for Walker Application Registration
 */
export function buildWalkerApplicationWhatsAppMessage(walker: WalkerApplication): string {
  return `🦮 *NOVO CADASTRO DE PASSEADOR — MUNDO DO PASSEIO*

👤 *Dados Pessoais:*
• Nome: *${walker.fullName}*
• CPF: ${walker.cpf || 'Informado'}
• WhatsApp: ${walker.phone}
• E-mail: ${walker.email}

📍 *Localização e Atendimento:*
• Estado: ${walker.state || 'ES'}
• Cidade: ${walker.city || 'Vitória'}
• Bairro / Região: ${walker.neighborhood || 'Centro'}
• Bairros Atendidos: ${walker.neighborhoodsServed || 'Região metropolitana'}
• Transporte: ${walker.transportMethod}

🐕 *Experiência & Preferências:*
• Tempo de experiência: ${walker.experienceDuration}
• Portes aceitos: ${(walker.dogSizesAccepted || []).join(', ')}
• Aceita múltiplos cães: ${walker.acceptsMultipleDogs ? `Sim (até ${walker.maxDogsPerWalk} cães)` : 'Somente individual'}
• Dias disponíveis: ${(walker.availableDays || []).join(', ')}
• Horário: ${walker.startTime || '07:00'} às ${walker.endTime || '18:00'}

📄 *Documentos & Antecedentes:*
• Status: *${walker.status}*
• Antecedentes e Comprovante de Residência anexados.

📄 *O PDF oficial com meu cadastro completo de 10 etapas foi baixado automaticamente no meu dispositivo e estou enviando aqui para validação pela equipe do Mundo do Passeio!*`;
}
