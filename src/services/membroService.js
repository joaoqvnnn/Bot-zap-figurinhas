// ==============================================
// LARI MYSTIC BOT - SERVIÇO DE MEMBROS
// ==============================================

const logger = require("../utils/logger");
const { limparNumero } = require("../utils/helpers");

const moderadores = new Map();

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

function concederPermissao(chatId, numero, comando) {
  const num = limparNumero(numero);
  if (!moderadores.has(chatId) || !moderadores.get(chatId).has(num)) return false;
  moderadores.get(chatId).get(num).add(comando.toLowerCase());
  return true;
}

function revogarPermissao(chatId, numero, comando) {
  const num = limparNumero(numero);
  if (!moderadores.has(chatId) || !moderadores.get(chatId).has(num)) return false;
  return moderadores.get(chatId).get(num).delete(comando.toLowerCase());
}

function temPermissao(chatId, numero, comando) {
  const num = limparNumero(numero);
  if (!moderadores.has(chatId)) return false;
  const grupo = moderadores.get(chatId);
  if (!grupo.has(num)) return false;
  return grupo.get(num).has(comando.toLowerCase());
}

function listarModeradores(chatId) {
  if (!moderadores.has(chatId)) return [];
  return Array.from(moderadores.get(chatId).keys());
}

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
