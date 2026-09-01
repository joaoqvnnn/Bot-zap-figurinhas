// ==============================================
// LARI MYSTIC BOT - HANDLER DE VERIFICAÇÃO ANTI-ROBÔ
// ==============================================

const logger = require("../utils/logger");
const { gerarDesafio, verificarResposta, limparDesafio } = require("../services/verificacaoService");

/**
 * Inicia verificação para novos membros.
 */
async function iniciarVerificacaoRobo(sock, chatId, usuario) {
  const emoji = gerarDesafio(chatId);
  await sock.sendMessage(chatId, {
    text: `🔐 Novo membro detectado!\n\nPara ser liberado, responda com o emoji:\n\n${emoji}`
  });
}

/**
 * Processa respostas de verificação.
 */
async function processarVerificacaoRobo(sock, message) {
  const texto = message.message.conversation || message.message.extendedTextMessage?.text || "";
  const chatId = message.key.remoteJid;
  const remetente = message.key.participant || message.key.remoteJid;

  if (!texto || !verificarResposta(chatId, texto)) return;

  await sock.sendMessage(chatId, { text: "✅ Verificação concluída! Bem-vindo(a)!" });
  limparDesafio(chatId);
}

module.exports = { iniciarVerificacaoRobo, processarVerificacaoRobo };
