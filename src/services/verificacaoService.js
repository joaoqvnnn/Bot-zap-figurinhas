// ==============================================
// LARI MYSTIC BOT - SERVIÇO DE VERIFICAÇÃO ANTI-ROBÔ
// ==============================================

const logger = require("../utils/logger");

// Emojis para desafio
const emojis = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯"];

// Armazena desafios ativos (chatId -> emoji esperado)
const desafios = new Map();

/**
 * Gera um desafio para novos membros.
 * @param {string} chatId
 * @returns {string} Emoji a ser respondido
 */
function gerarDesafio(chatId) {
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];
  desafios.set(chatId, emoji);
  return emoji;
}

/**
 * Verifica se a resposta está correta.
 * @param {string} chatId
 * @param {string} resposta
 * @returns {boolean}
 */
function verificarResposta(chatId, resposta) {
  const esperado = desafios.get(chatId);
  if (!esperado) return false;
  if (resposta.trim() === esperado) {
    desafios.delete(chatId);
    return true;
  }
  return false;
}

/**
 * Remove desafio ativo.
 * @param {string} chatId
 */
function limparDesafio(chatId) {
  desafios.delete(chatId);
}

module.exports = {
  gerarDesafio,
  verificarResposta,
  limparDesafio,
};
