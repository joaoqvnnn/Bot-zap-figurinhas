// ==============================================
// LARI MYSTIC BOT - FUNÇÕES AUXILIARES
// ==============================================

/**
 * Extrai dados essenciais de uma mensagem do Baileys.
 * @param {object} message - Mensagem recebida do WhatsApp
 * @returns {object|null} Dados normalizados ou null se mensagem inválida
 */
function extrairDadosMensagem(message) {
  if (!message || !message.key) return null;

  const remetente = message.key.participant || message.key.remoteJid;
  const chatId = message.key.remoteJid;
  const isGroup = chatId.endsWith("@g.us");
  const messageObj = message.message || {};

  // Extrai texto de diferentes formatos
  let texto = "";
  let tipo = "texto";

  if (messageObj.conversation) {
    texto = messageObj.conversation;
    tipo = "texto";
  } else if (messageObj.extendedTextMessage) {
    texto = messageObj.extendedTextMessage.text || "";
    tipo = "texto";
  } else if (messageObj.imageMessage) {
    texto = messageObj.imageMessage.caption || "";
    tipo = "imagem";
  } else if (messageObj.videoMessage) {
    texto = messageObj.videoMessage.caption || "";
    tipo = "video";
  } else if (messageObj.stickerMessage) {
    tipo = "sticker";
  } else if (messageObj.audioMessage) {
    tipo = "audio";
  } else if (messageObj.documentMessage) {
    texto = messageObj.documentMessage.fileName || "";
    tipo = "documento";
  } else if (messageObj.contactMessage) {
    tipo = "contato";
  } else if (messageObj.locationMessage) {
    tipo = "localizacao";
  }

  return {
    remetente,
    chatId,
    isGroup,
    texto,
    tipo,
    messageObj,
  };
}

/**
 * Normaliza texto removendo espaços extras e convertendo para minúsculas.
 * @param {string} texto
 * @returns {string}
 */
function normalizarTexto(texto) {
  return String(texto || "").trim().toLowerCase();
}

/**
 * Gera um ID único simples baseado em timestamp + número aleatório.
 * @returns {string}
 */
function gerarIdUnico() {
  return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

/**
 * Converte número em formato internacional, removendo caracteres não numéricos.
 * @param {string} numero
 * @returns {string}
 */
function limparNumero(numero) {
  return String(numero || "").replace(/\D/g, "");
}

/**
 * Verifica se a mensagem é de um grupo.
 * @param {string} jid - ID do chat no formato do Baileys
 * @returns {boolean}
 */
function isGroup(jid) {
  return String(jid || "").endsWith("@g.us");
}

/**
 * Extrai o número do remetente (sem @s.whatsapp.net, etc.)
 * @param {string} remetente
 * @returns {string}
 */
function extrairNumero(remetente) {
  return String(remetente || "").replace(/@.*$/, "");
}

module.exports = {
  extrairDadosMensagem,
  normalizarTexto,
  gerarIdUnico,
  limparNumero,
  isGroup,
  extrairNumero,
};
