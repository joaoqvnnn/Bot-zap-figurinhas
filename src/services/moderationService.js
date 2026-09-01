// ==============================================
// LARI MYSTIC BOT - SERVIÇO DE MODERAÇÃO
// ==============================================

const logger = require("../utils/logger");
const { limparNumero } = require("../utils/helpers");
const { adicionarListaNegra, removerListaNegra, isListaNegra, getListaNegra } = require("./listaNegraService");

// Armazena usuários silenciados temporariamente (número -> timestamp de liberação)
const silenciados = new Map();

/**
 * Silencia um usuário por um período.
 * @param {string} numero - Número do usuário
 * @param {number} minutos - Tempo de mute em minutos
 */
function silenciarUsuario(numero, minutos = 5) {
  const numeroLimpo = limparNumero(numero);
  const liberarEm = Date.now() + minutos * 60000;
  silenciados.set(numeroLimpo, liberarEm);
  logger.info(`Usuário ${numeroLimpo} silenciado por ${minutos} min.`);
}

/**
 * Remove o silêncio de um usuário.
 * @param {string} numero
 */
function dessilenciarUsuario(numero) {
  const numeroLimpo = limparNumero(numero);
  silenciados.delete(numeroLimpo);
}

/**
 * Verifica se um usuário está silenciado.
 * @param {string} numero
 * @returns {boolean}
 */
function isSilenciado(numero) {
  const numeroLimpo = limparNumero(numero);
  if (!silenciados.has(numeroLimpo)) return false;
  const liberarEm = silenciados.get(numeroLimpo);
  if (Date.now() > liberarEm) {
    silenciados.delete(numeroLimpo);
    return false;
  }
  return true;
}

module.exports = {
  silenciarUsuario,
  dessilenciarUsuario,
  isSilenciado,
};
