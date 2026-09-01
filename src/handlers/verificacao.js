// ==============================================
// LARI MYSTIC BOT - HANDLER DE VERIFICAÇÃO
// ==============================================

const logger = require("../utils/logger");
const { gerarDesafio, verificarResposta, limparDesafio } = require("../services/verificacaoService");

/**
 * Inicia verificação para novos membros.
 */
async function iniciarVerificacao(sock, chatId, usuario) {
  const emoji = gerarDesafio(chatId);
  await sock.sendMessage(chatId, {
    text: `🔐 Verificação anti-robô!\n\nNovo membro, responda com o emoji abaixo para ser liberado:\n\n${emoji}`
  });
}

/**
 * Processa respostas de verificação.
 */
async function processarVerificacao(sock, message) {
  const texto = message.message.conversation || message.message.extendedTextMessage?.text || "";
  const chatId = message.key.remoteJid;
  const remetente = message.key.participant || message.key.remoteJid;

  if (!texto) return;

  if (verificarResposta(chatId, texto)) {
    await sock.sendMessage(chatId, { text: "✅ Verificação concluída! Bem-vindo(a)!" });
  }
}

module.exports = { iniciarVerificacao, processarVerificacao };
