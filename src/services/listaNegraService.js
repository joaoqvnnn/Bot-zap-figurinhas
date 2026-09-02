// ==============================================
// LARI MYSTIC BOT - GERENCIAMENTO DE LISTA NEGRA
// ==============================================

const logger = require("../utils/logger");
const { limparNumero } = require("../utils/helpers");

const listaNegra = new Set();

function adicionarListaNegra(numero) {
  const numeroLimpo = limparNumero(numero);
  if (!numeroLimpo) return false;
  if (listaNegra.has(numeroLimpo)) return false;
  listaNegra.add(numeroLimpo);
  logger.info(`Número ${numeroLimpo} adicionado à lista negra global.`);
  return true;
}

function removerListaNegra(numero) {
  const numeroLimpo = limparNumero(numero);
  return listaNegra.delete(numeroLimpo);
}

function isListaNegra(numero) {
  return listaNegra.has(limparNumero(numero));
}

function getListaNegra() {
  return Array.from(listaNegra);
}

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
