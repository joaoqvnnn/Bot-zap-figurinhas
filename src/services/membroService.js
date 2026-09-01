// ==============================================
// LARI MYSTIC BOT - SERVIÇO DE GESTÃO DE MEMBROS
// ==============================================

const logger = require("../utils/logger");
const { limparNumero } = require("../utils/helpers");

// Armazena moderadores e permissões customizadas em memória
const moderadores = new Map(); // chatId -> Map(numero -> permissões)

/**
 * Adiciona moderador a um grupo.
 */
function adicionarModerador(chatId, numero) {
  const num = limparNumero(numero);
  if (!moderadores.has(chatId)) {
    moderadores.set(chatId, new Map());
  }
  const grupo = moderadores.get(chatId);
  if (!grupo.has(num)) {
    grupo.set(num, new Set());
    logger.info(`Moderador ${num} adicionado no grupo ${chatId}`);
    return true;
  }
  return false;
}

/**
 * Remove moderador de um grupo.
 */
function removerModerador(chatId, numero) {
  const num = limparNumero(numero);
  if (moderadores.has(chatId)) {
    const grupo = moderadores.get(chatId);
    if (grupo.delete(num)) {
      logger.info(`Moderador ${num} removido do grupo ${chatId}`);
      return true;
    }
  }
  return false;
}

/**
 * Concede permissão de comando a um moderador.
 */
function concederPermissao(chatId, numero, comando) {
  const num = limparNumero(numero);
  if (!moderadores.has(chatId) || !moderadores.get(chatId).has(num)) return false;
  moderadores.get(chatId).get(num).add(comando.toLowerCase());
  return true;
}

/**
 * Revoga permissão de comando de um moderador.
 */
function revogarPermissao(chatId, numero, comando) {
  const num = limparNumero(numero);
  if (!moderadores.has(chatId) || !moderadores.get(chatId).has(num)) return false;
  return moderadores.get(chatId).get(num).delete(comando.toLowerCase());
}

/**
 * Verifica se um moderador pode executar um comando.
 */
function temPermissao(chatId, numero, comando) {
  const num = limparNumero(numero);
  if (!moderadores.has(chatId)) return false;
  const grupo = moderadores.get(chatId);
  if (!grupo.has(num)) return false;
  return grupo.get(num).has(comando.toLowerCase());
}

/**
 * Lista moderadores de um grupo.
 */
function listarModeradores(chatId) {
  if (!moderadores.has(chatId)) return [];
  return Array.from(moderadores.get(chatId).keys());
}

/**
 * Lista permissões de um moderador.
 */
function listarPermissoes(chatId, numero) {
  const num = limparNumero(numero);
  if (!moderadores.has(chatId) || !moderadores.get(chatId).has(num)) return [];
  return Array.from(moderadores.get(chatId).get(num));
}

module.exports = {
  adicionarModerador,
  removerModerador,
  concederPermissao,
  revogarPermissao,
  temPermissao,
  listarModeradores,
  listarPermissoes,
};
