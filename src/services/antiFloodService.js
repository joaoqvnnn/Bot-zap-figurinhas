// ==============================================
// LARI MYSTIC BOT - SERVIÇO ANTI-FLOOD
// ==============================================

const logger = require("../utils/logger");

// Armazena timestamps de mensagens por usuário
const mensagensPorUsuario = new Map();
const LIMITE_MENSAGENS = 5; // máximo de mensagens em 5 segundos
const JANELA_TEMPO = 5000; // 5 segundos
const TEMPO_BLOQUEIO = 10000; // 10 segundos

/**
 * Verifica se um usuário está em flood.
 * @param {string} remetente
 * @returns {boolean} true se bloqueado por flood
 */
function verificarFlood(remetente) {
  const agora = Date.now();
  const timestamps = mensagensPorUsuario.get(remetente) || [];

  // Remove timestamps antigos
  const recentes = timestamps.filter(t => agora - t < JANELA_TEMPO);

  if (recentes.length >= LIMITE_MENSAGENS) {
    logger.warn(`Flood detectado para ${remetente}`);
    // Bloqueia por TEMPO_BLOQUEIO
    mensagensPorUsuario.set(remetente, [...recentes, agora]);
    return true;
  }

  recentes.push(agora);
  mensagensPorUsuario.set(remetente, recentes);
  return false;
}

/**
 * Remove o bloqueio de flood de um usuário (após tempo).
 * Pode ser chamado periodicamente.
 */
function limparFlood(remetente) {
  mensagensPorUsuario.delete(remetente);
}

module.exports = {
  verificarFlood,
  limparFlood,
};
