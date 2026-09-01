// ==============================================
// LARI MYSTIC BOT - SERVIÇO DE CONFIGURAÇÕES
// ==============================================

const logger = require("../utils/logger");

// Configurações em memória (será migrado para MongoDB)
const configuracoes = new Map();

/**
 * Define uma configuração para um grupo.
 * @param {string} chatId
 * @param {string} chave
 * @param {any} valor
 */
function setConfig(chatId, chave, valor) {
  if (!configuracoes.has(chatId)) {
    configuracoes.set(chatId, new Map());
  }
  const grupoConfig = configuracoes.get(chatId);
  grupoConfig.set(chave, valor);
  logger.info(`Config '${chave}' definida para ${chatId}`);
}

/**
 * Obtém uma configuração do grupo.
 * @param {string} chatId
 * @param {string} chave
 * @param {any} padrao
 * @returns {any}
 */
function getConfig(chatId, chave, padrao = null) {
  if (!configuracoes.has(chatId)) return padrao;
  const grupoConfig = configuracoes.get(chatId);
  return grupoConfig.has(chave) ? grupoConfig.get(chave) : padrao;
}

/**
 * Lista todas as configurações de um grupo.
 */
function listarConfigs(chatId) {
  if (!configuracoes.has(chatId)) return {};
  const grupoConfig = configuracoes.get(chatId);
  const obj = {};
  for (const [chave, valor] of grupoConfig.entries()) {
    obj[chave] = valor;
  }
  return obj;
}

/**
 * Remove uma configuração.
 */
function removerConfig(chatId, chave) {
  if (!configuracoes.has(chatId)) return false;
  return configuracoes.get(chatId).delete(chave);
}

module.exports = {
  setConfig,
  getConfig,
  listarConfigs,
  removerConfig,
};
