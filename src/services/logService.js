// ==============================================
// LARI MYSTIC BOT - SERVIÇO DE LOGS
// ==============================================

const logger = require("../utils/logger");
const { formatarDataHora } = require("../utils/dateUtils");

// Armazena logs em memória (será migrado para MongoDB)
const logs = [];

/**
 * Registra uma ação no log.
 * @param {string} acao - Descrição da ação
 * @param {object} detalhes - Detalhes adicionais
 */
function registrarLog(acao, detalhes = {}) {
  const entrada = {
    timestamp: formatarDataHora(),
    acao,
    detalhes,
  };
  logs.push(entrada);
  logger.debug(`Log registrado: ${acao}`);

  // Limita a 1000 registros para não consumir memória
  if (logs.length > 1000) {
    logs.shift();
  }
}

/**
 * Retorna os últimos logs.
 * @param {number} limite - Quantidade de logs
 * @returns {Array}
 */
function obterLogs(limite = 50) {
  return logs.slice(-limite).reverse();
}

/**
 * Retorna logs filtrados por ação.
 * @param {string} acao
 * @returns {Array}
 */
function filtrarLogsPorAcao(acao) {
  return logs.filter(log => log.acao.includes(acao));
}

module.exports = {
  registrarLog,
  obterLogs,
  filtrarLogsPorAcao,
};
