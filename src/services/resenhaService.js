// ==============================================
// LARI MYSTIC BOT - SERVIÇO DE RESENHAS
// ==============================================

const logger = require("../utils/logger");
const { gerarIdUnico } = require("../utils/helpers");

// Banco de dados em memória (será migrado para MongoDB)
global.resenhas = new Map();

/**
 * Cria uma nova resenha.
 * @param {string} titulo
 * @param {string} criadaPor
 * @returns {string} ID da resenha
 */
function criarResenha(titulo, criadaPor) {
  const id = gerarIdUnico();
  global.resenhas.set(id, {
    id,
    titulo: titulo || "Nova resenha",
    itens: [],
    pagamentos: [],
    criadaPor,
    criadaEm: new Date().toISOString(),
  });
  logger.info(`Resenha criada: ${id} - ${titulo}`);
  return id;
}

/**
 * Adiciona itens a uma resenha.
 * @param {string} id
 * @param {string[]} itens
 * @returns {boolean}
 */
function adicionarItens(id, itens) {
  const resenha = global.resenhas.get(id);
  if (!resenha) return false;
  resenha.itens.push(...itens);
  return true;
}

/**
 * Marca um pagamento na resenha.
 * @param {string} id
 * @param {string} pagoPor
 * @param {number} valor
 * @returns {boolean}
 */
function marcarPagamento(id, pagoPor, valor = 0) {
  const resenha = global.resenhas.get(id);
  if (!resenha) return false;
  resenha.pagamentos.push({
    data: new Date().toISOString(),
    pagoPor,
    valor,
  });
  return true;
}

/**
 * Lista todas as resenhas.
 * @returns {object[]}
 */
function listarResenhas() {
  return Array.from(global.resenhas.values());
}

/**
 * Encontra resenha por ID.
 * @param {string} id
 * @returns {object|null}
 */
function getResenha(id) {
  return global.resenhas.get(id) || null;
}

/**
 * Exclui uma resenha.
 * @param {string} id
 * @returns {boolean}
 */
function excluirResenha(id) {
  return global.resenhas.delete(id);
}

module.exports = {
  criarResenha,
  adicionarItens,
  marcarPagamento,
  listarResenhas,
  getResenha,
  excluirResenha,
};
