// ==============================================
// LARI MYSTIC BOT - HANDLER PRINCIPAL DE MENSAGENS
// ==============================================

const logger = require("../utils/logger");
const { extrairDadosMensagem, normalizarTexto } = require("../utils/helpers");
const { processarCarta, processarRespostaCarta } = require("../menus/cartaMisteriosa");
const { verificarPermissao } = require("../menus/permissoes");
const { isBlocked } = require("../services/segurancaService");

// Importa os handlers específicos
const { handleStart } = require("./start");
const { handleDiversao } = require("./diversao");
const { handleModeracao } = require("./moderacao");
const { handleRPG } = require("./rpg");
const { handleAdmin } = require("./admin");
const { handleResenhas } = require("./resenhas");
const { handleGroupManagement } = require("./groupManagement");
const { handleStickers } = require("./stickers");

/**
 * Função principal chamada quando uma mensagem é recebida.
 * @param {object} sock - Socket do Baileys
 * @param {object} message - Mensagem do WhatsApp
 */
async function handleMessage(sock, message) {
  const dados = extrairDadosMensagem(message);
  if (!dados) return;

  const { chatId, remetente, texto, tipo, isGroup } = dados;

  // Verifica se o usuário está bloqueado na lista negra
  if (await isBlocked(remetente)) {
    logger.warn(`Mensagem bloqueada de ${remetente} (lista negra).`);
    return;
  }

  // Tenta processar o menu/carta primeiro
  const iniciouCarta = await handleStart(sock, message);
  if (iniciouCarta) return;

  // Se for comando com "!" ou "/", verifica permissão e encaminha
  if (texto && (texto.startsWith("/") || texto.startsWith("!"))) {
    const comando = normalizarTexto(texto.slice(1).split(" ")[0]);

    // Verifica permissão para o comando
    const permitido = await verificarPermissao(sock, chatId, remetente, comando, isGroup);
    if (!permitido) {
      await sock.sendMessage(chatId, { text: "⛔ Você não tem permissão para usar este comando." });
      return;
    }

    // Encaminha para o handler específico conforme o comando
    await handleDiversao(sock, message);
    await handleModeracao(sock, message);
    await handleRPG(sock, message);
    await handleAdmin(sock, message);
    await handleResenhas(sock, message);
    await handleGroupManagement(sock, message);
    await handleStickers(sock, message);
  }
}

module.exports = { handleMessage };
