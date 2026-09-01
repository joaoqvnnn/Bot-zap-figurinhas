// ==============================================
// LARI MYSTIC BOT - GERENCIAMENTO AVANÇADO DE LISTA NEGRA
// ==============================================

const logger = require("../utils/logger");
const { limparNumero } = require("../utils/helpers");

// Lista negra global em memória
const listaNegra = new Set();

/**
 * Adiciona número à lista negra global.
 * @param {string} numero
 * @returns {boolean}
 */
function adicionarListaNegra(numero) {
  const numeroLimpo = limparNumero(numero);
  if (!numeroLimpo) return false;
  if (listaNegra.has(numeroLimpo)) return false;
  listaNegra.add(numeroLimpo);
  logger.info(`Número ${numeroLimpo} adicionado à lista negra global.`);
  return true;
}

/**
 * Remove número da lista negra.
 * @param {string} numero
 * @returns {boolean}
 */
function removerListaNegra(numero) {
  const numeroLimpo = limparNumero(numero);
  return listaNegra.delete(numeroLimpo);
}

/**
 * Verifica se número está na lista negra.
 * @param {string} numero
 * @returns {boolean}
 */
function isListaNegra(numero) {
  return listaNegra.has(limparNumero(numero));
}

/**
 * Retorna todos os números da lista negra.
 * @returns {string[]}
 */
function getListaNegra() {
  return Array.from(listaNegra);
}

/**
 * Limpa a lista negra.
 */
function limparListaNegra() {
  listaNegra.clear();
}

module.exports = {
  adicionarListaNegra,
  removerListaNegra,
  isListaNegra,
  getListaNegra,
  limparListaNegra,
};
