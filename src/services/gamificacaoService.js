// ==============================================
// LARI MYSTIC BOT - SERVIÇO DE GAMIFICAÇÃO
// ==============================================

const logger = require("../utils/logger");

// Armazena pontos dos usuários em memória
const pontosUsuarios = new Map();

/**
 * Adiciona pontos a um usuário.
 * @param {string} remetente
 * @param {number} pontos
 */
function adicionarPontos(remetente, pontos) {
  const numero = remetente.split("@")[0];
  const atual = pontosUsuarios.get(numero) || 0;
  pontosUsuarios.set(numero, atual + pontos);
}

/**
 * Obtém os pontos de um usuário.
 * @param {string} remetente
 * @returns {number}
 */
function obterPontos(remetente) {
  const numero = remetente.split("@")[0];
  return pontosUsuarios.get(numero) || 0;
}

/**
 * Retorna o ranking dos usuários com mais pontos.
 * @param {number} limite
 * @returns {Array<{numero: string, pontos: number}>}
 */
function obterRanking(limite = 10) {
  return Array.from(pontosUsuarios.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limite)
    .map(([numero, pontos]) => ({ numero, pontos }));
}

/**
 * Concede pontos por atividade (mensagens, comandos, etc.).
 * @param {string} remetente
 */
function registrarAtividade(remetente) {
  adicionarPontos(remetente, 1);
}

module.exports = {
  adicionarPontos,
  obterPontos,
  obterRanking,
  registrarAtividade,
};
