// ==============================================
// LARI MYSTIC BOT - RESPOSTAS RÁPIDAS E AUTOMAÇÕES
// ==============================================

const logger = require("../utils/logger");
const { registrarLog } = require("../services/logService");

/**
 * Respostas automáticas baseadas em palavras-chave.
 * Pode ser usado para saudações e respostas comuns.
 */
const respostas = [
  { padrao: /^(bom dia|bomdia|bd)\b/i, resposta: "☀️ Bom dia! Que seu dia seja incrível!" },
  { padrao: /^(boa tarde|boatarde|bt)\b/i, resposta: "🌤️ Boa tarde! Como posso ajudar?" },
  { padrao: /^(boa noite|boanoite|bn)\b/i, resposta: "🌙 Boa noite! Que o descanso seja ótimo!" },
  { padrao: /^(obrigado|obrigada|vlw|valeu)\b/i, resposta: "😊 Por nada! Estou aqui para ajudar." },
];

/**
 * Processa mensagens e responde automaticamente se houver correspondência.
 * @param {object} sock
 * @param {object} message
 * @returns {boolean} true se respondeu automaticamente
 */
async function processarRespostasRapidas(sock, message) {
  const texto = message.message.conversation || message.message.extendedTextMessage?.text || "";
  if (!texto) return false;

  const chatId = message.key.remoteJid;

  for (const item of respostas) {
    if (item.padrao.test(texto.trim())) {
      await sock.sendMessage(chatId, { text: item.resposta });
      registrarLog("resposta_rapida", { chatId, texto, resposta: item.resposta });
      return true;
    }
  }

  return false;
}

module.exports = { processarRespostasRapidas };
