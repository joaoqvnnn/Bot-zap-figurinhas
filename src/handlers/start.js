// ==============================================
// LARI MYSTIC BOT - HANDLER DE ENTRADA (MENU/CARTA)
// ==============================================

const logger = require("../utils/logger");
const { processarCarta, processarRespostaCarta } = require("../menus/cartaMisteriosa");
const { extrairDadosMensagem } = require("../utils/helpers");

/**
 * Processa o comando inicial "menu" ou "carta".
 * @param {object} sock - Socket do Baileys
 * @param {object} message - Mensagem do WhatsApp
 */
async function handleStart(sock, message) {
  const dados = extrairDadosMensagem(message);
  if (!dados) return;

  const { chatId, remetente, texto, isGroup } = dados;

  // Se o texto for "menu" ou "carta", inicia a carta principal
  const comando = texto.toLowerCase().trim();
  if (comando === "menu" || comando === "carta" || comando === "/menu") {
    await processarCarta(sock, chatId, remetente, isGroup);
    return true;
  }

  // Se houver estado de carta ativo, processa a resposta
  const numero = remetente.split("@")[0];
  if (global.estadoCartas && global.estadoCartas.has(numero)) {
    await processarRespostaCarta(sock, chatId, remetente, texto);
    return true;
  }

  return false;
}

module.exports = { handleStart };
