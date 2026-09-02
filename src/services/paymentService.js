// ==============================================
// LARI MYSTIC BOT - SERVIÇO DE PAGAMENTOS
// ==============================================

const logger = require("../utils/logger");
const { gerarIdUnico, limparNumero } = require("../utils/helpers");

const cobrancas = new Map();

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

function marcarComoPaga(id) {
  const cobranca = cobrancas.get(id);
  if (!cobranca) return false;
  cobranca.status = "paga";
  cobranca.pagaEm = new Date().toISOString();
  return true;
}

function getCobranca(id) {
  return cobrancas.get(id) || null;
}

function listarPendentes() {
  return Array.from(cobrancas.values()).filter(c => c.status === "pendente");
}

module.exports = {
  criarCobranca,
  marcarComoPaga,
  getCobranca,
  listarPendentes,
};
