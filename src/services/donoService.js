// ==============================================
// LARI MYSTIC BOT - SERVIÇO DO DONO
// ==============================================

const logger = require("../utils/logger");

// Estado de manutenção global
let modoManutencao = false;

// Palavras proibidas globais
const palavrasProibidas = new Set();

/**
 * Ativa/desativa modo manutenção.
 */
function setModoManutencao(ativo) {
  modoManutencao = ativo;
  logger.info(`Modo manutenção ${ativo ? "ativado" : "desativado"}.`);
}

/**
 * Verifica se está em manutenção.
 */
function isModoManutencao() {
  return modoManutencao;
}

/**
 * Adiciona palavra proibida.
 */
function adicionarPalavraProibida(palavra) {
  palavrasProibidas.add(palavra.toLowerCase().trim());
}

/**
 * Remove palavra proibida.
 */
function removerPalavraProibida(palavra) {
  palavrasProibidas.delete(palavra.toLowerCase().trim());
}

/**
 * Verifica se uma palavra é proibida.
 */
function isPalavraProibida(texto) {
  const palavras = texto.toLowerCase().split(" ");
  return palavras.some(p => palavrasProibidas.has(p));
}

/**
 * Lista palavras proibidas.
 */
function listarPalavrasProibidas() {
  return Array.from(palavrasProibidas);
}

module.exports = {
  setModoManutencao,
  isModoManutencao,
  adicionarPalavraProibida,
  removerPalavraProibida,
  isPalavraProibida,
  listarPalavrasProibidas,
};
