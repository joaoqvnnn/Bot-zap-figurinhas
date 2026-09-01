// ==============================================
// LARI MYSTIC BOT - SERVIÇO DE PAGAMENTOS
// ==============================================

const logger = require("../utils/logger");
const { gerarIdUnico } = require("../utils/helpers");

// Armazena cobranças em memória
const cobrancas = new Map();

/**
 * Cria uma nova cobrança (simulada, placeholder para gateway real).
 * @param {string} usuario - Número do usuário
 * @param {number} valor - Valor da cobrança
 * @param {string} descricao
 * @returns {string} ID da cobrança
 */
function criarCobranca(usuario, valor, descricao) {
  const id = gerarIdUnico();
  cobrancas.set(id, {
    id,
    usuario: limparNumero(usuario),
    valor,
    descricao,
    status: "pendente",
    criadaEm: new Date().toISOString(),
  });
  logger.info(`Cobrança ${id} criada para ${usuario} no valor de R$ ${valor}`);
  return id;
}

/**
 * Marca uma cobrança como paga.
 * @param {string} id
 * @returns {boolean}
 */
function marcarComoPaga(id) {
  const cobranca = cobrancas.get(id);
  if (!cobranca) return false;
  cobranca.status = "paga";
  cobranca.pagaEm = new Date().toISOString();
  return true;
}

/**
 * Obtém os dados de uma cobrança.
 * @param {string} id
 * @returns {object|null}
 */
function getCobranca(id) {
  return cobrancas.get(id) || null;
}

/**
 * Lista cobranças pendentes.
 * @returns {object[]}
 */
function listarPendentes() {
  return Array.from(cobrancas.values()).filter(c => c.status === "pendente");
}

module.exports = {
  criarCobranca,
  marcarComoPaga,
  getCobranca,
  listarPendentes,
};
