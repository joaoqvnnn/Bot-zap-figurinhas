// ==============================================
// LARI MYSTIC BOT - SERVIÇO DE SEGURANÇA
// ==============================================

const config = require("../config");
const logger = require("../utils/logger");
const { limparNumero } = require("../utils/helpers");

// Estrutura de dados em memória (será migrada para MongoDB)
const listaNegraGlobal = new Set();
const protecoesAtivas = new Map();
const tentativasToken = new Map();
const registroAcoes = [];

// Funções básicas de segurança
async function isBlocked(remetente) {
  const numero = limparNumero(remetente.split("@")[0]);
  return listaNegraGlobal.has(numero);
}

async function adicionarListaNegra(numero) {
  const numeroLimpo = limparNumero(numero);
  if (numeroLimpo) {
    listaNegraGlobal.add(numeroLimpo);
    logger.info(`Número ${numeroLimpo} adicionado à lista negra global.`);
    return true;
  }
  return false;
}

async function removerListaNegra(numero) {
  const numeroLimpo = limparNumero(numero);
  if (numeroLimpo && listaNegraGlobal.has(numeroLimpo)) {
    listaNegraGlobal.delete(numeroLimpo);
    logger.info(`Número ${numeroLimpo} removido da lista negra.`);
    return true;
  }
  return false;
}

async function getListaNegra() {
  return Array.from(listaNegraGlobal);
}

async function ativarProtecao(chatId, protecao, valor = true) {
  if (!protecoesAtivas.has(chatId)) {
    protecoesAtivas.set(chatId, new Map());
  }
  const grupoProtecoes = protecoesAtivas.get(chatId);
  grupoProtecoes.set(protecao, valor);
  logger.info(`Proteção '${protecao}' ${valor ? "ativada" : "desativada"} no chat ${chatId}`);
  return true;
}

async function desativarProtecao(chatId, protecao) {
  return ativarProtecao(chatId, protecao, false);
}

async function getProtecoesAtivas(chatId) {
  if (!protecoesAtivas.has(chatId)) return [];
  const grupoProtecoes = protecoesAtivas.get(chatId);
  return Array.from(grupoProtecoes.entries())
    .filter(([_, ativo]) => ativo)
    .map(([nome]) => nome);
}

async function isProtecaoAtiva(chatId, protecao) {
  if (!protecoesAtivas.has(chatId)) return false;
  return protecoesAtivas.get(chatId).get(protecao) === true;
}

async function registrarTentativaToken(remetente) {
  const numero = limparNumero(remetente.split("@")[0]);
  const tentativas = (tentativasToken.get(numero) || 0) + 1;
  tentativasToken.set(numero, tentativas);
  return tentativas;
}

async function resetarTentativasToken(remetente) {
  const numero = limparNumero(remetente.split("@")[0]);
  tentativasToken.delete(numero);
}

async function getTentativasToken(remetente) {
  const numero = limparNumero(remetente.split("@")[0]);
  return tentativasToken.get(numero) || 0;
}

async function registrarAcao(acao, detalhes = {}) {
  registroAcoes.push({
    timestamp: new Date().toISOString(),
    acao,
    detalhes,
  });
  logger.debug(`Ação registrada: ${acao}`);
  // Limita a 500 registros em memória
  if (registroAcoes.length > 500) {
    registroAcoes.shift();
  }
}

async function getUltimosLogs(limite = 50) {
  return registroAcoes.slice(-limite).reverse();
}

module.exports = {
  isBlocked,
  adicionarListaNegra,
  removerListaNegra,
  getListaNegra,
  ativarProtecao,
  desativarProtecao,
  getProtecoesAtivas,
  isProtecaoAtiva,
  registrarTentativaToken,
  resetarTentativasToken,
  getTentativasToken,
  registrarAcao,
  getUltimosLogs,
};
