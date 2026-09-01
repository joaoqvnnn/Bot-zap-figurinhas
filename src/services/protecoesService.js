// ==============================================
// LARI MYSTIC BOT - SERVIÇO DE PROTEÇÕES
// ==============================================

const logger = require("../utils/logger");
const { isLink } = require("../utils/validators");
const { isProtecaoAtiva } = require("./segurancaService");

/**
 * Verifica se uma mensagem deve ser bloqueada de acordo com as proteções ativas.
 * @param {string} chatId
 * @param {object} message - Mensagem do Baileys
 * @returns {Promise<boolean>} true se deve bloquear
 */
async function deveBloquearMensagem(chatId, message) {
  const texto = message.message?.conversation || 
                message.message?.extendedTextMessage?.text || 
                message.message?.imageMessage?.caption || 
                message.message?.videoMessage?.caption || 
                "";

  // Anti-link
  if (await isProtecaoAtiva(chatId, "anti-link")) {
    if (isLink(texto)) {
      logger.info("Mensagem bloqueada por anti-link.");
      return true;
    }
  }

  // Anti-documento
  if (await isProtecaoAtiva(chatId, "anti-doc")) {
    if (message.message?.documentMessage) {
      logger.info("Mensagem bloqueada por anti-doc.");
      return true;
    }
  }

  // Anti-foto
  if (await isProtecaoAtiva(chatId, "anti-foto")) {
    if (message.message?.imageMessage) {
      logger.info("Mensagem bloqueada por anti-foto.");
      return true;
    }
  }

  // Anti-vídeo
  if (await isProtecaoAtiva(chatId, "anti-video")) {
    if (message.message?.videoMessage) {
      logger.info("Mensagem bloqueada por anti-video.");
      return true;
    }
  }

  // Anti-áudio
  if (await isProtecaoAtiva(chatId, "anti-audio")) {
    if (message.message?.audioMessage) {
      logger.info("Mensagem bloqueada por anti-audio.");
      return true;
    }
  }

  // Anti-figurinha
  if (await isProtecaoAtiva(chatId, "anti-fig")) {
    if (message.message?.stickerMessage) {
      logger.info("Mensagem bloqueada por anti-fig.");
      return true;
    }
  }

  // Anti-localização
  if (await isProtecaoAtiva(chatId, "anti-loc")) {
    if (message.message?.locationMessage) {
      logger.info("Mensagem bloqueada por anti-loc.");
      return true;
    }
  }

  // Anti-contato
  if (await isProtecaoAtiva(chatId, "anti-contact")) {
    if (message.message?.contactMessage) {
      logger.info("Mensagem bloqueada por anti-contact.");
      return true;
    }
  }

  return false;
}

/**
 * Verifica se deve banir por flood (excesso de mensagens).
 */
async function devePunirFlood(chatId, remetente) {
  if (!await isProtecaoAtiva(chatId, "anti-flood")) return false;
  const { verificarFlood } = require("./antiFloodService");
  return verificarFlood(remetente);
}

module.exports = {
  deveBloquearMensagem,
  devePunirFlood,
};
