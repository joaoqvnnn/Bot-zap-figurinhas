// ==============================================
// LARI MYSTIC BOT - HANDLER PRINCIPAL DE MENSAGENS
// ==============================================

const logger = require("../utils/logger");
const config = require("../config");
const { extrairDadosMensagem } = require("../utils/helpers");
const { processarCarta } = require("../menus/cartaMisteriosa");
const { verificarPermissao } = require("../menus/permissoes");

/**
 * Função principal chamada quando uma mensagem é recebida.
 * @param {object} sock - Socket do Baileys
 * @param {object} message - Mensagem do WhatsApp
 */
async function handleMessage(sock, message) {
  const dados = extrairDadosMensagem(message);
  if (!dados) return;

  const { chatId, remetente, texto, tipo, isGroup, messageObj } = dados;

  // Verifica se o usuário está bloqueado na lista negra
  const { isBlocked } = require("../services/segurancaService");
  if (await isBlocked(remetente)) {
    logger.warn(`Mensagem bloqueada de ${remetente} (lista negra).`);
    return;
  }

  // Se for comando simples com "!" ou "/", verifica permissão
  if (texto && (texto.startsWith("/") || texto.startsWith("!"))) {
    const comando = texto.slice(1).split(" ")[0].toLowerCase();
    const permitido = await verificarPermissao(sock, chatId, remetente, comando, isGroup);
    if (!permitido) {
      await sock.sendMessage(chatId, { text: "⛔ Você não tem permissão para usar este comando." });
      return;
    }
  }

  // Processa o sistema de cartas místicas (menu interativo)
  if (texto && (texto.toLowerCase() === "menu" || texto.toLowerCase() === "carta" || texto.toLowerCase() === "/menu")) {
    await processarCarta(sock, chatId, remetente, isGroup);
    return;
  }

  // Placeholder para futuros handlers de moderação, diversão, etc.
  // Serão adicionados conforme avançarmos.
}

module.exports = { handleMessage };
