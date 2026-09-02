// ==============================================
// LARI MYSTIC BOT - HANDLER PRINCIPAL
// ==============================================

const logger = require("../utils/logger");
const { extrairDadosMensagem, normalizarTexto } = require("../utils/helpers");
const { verificarPermissao } = require("../menus/permissoes");
const { isBlocked } = require("../services/segurancaService");
const { processarCarta } = require("../menus/cartaMisteriosa");

const { handleDiversao } = require("./diversao");
const { handleModeracao } = require("./moderacao");
const { handleRPG } = require("./rpg");
const { handleAdmin } = require("./admin");
const { handleResenhas } = require("./resenhas");
const { handleGroupManagement } = require("./groupManagement");
const { handleStickers } = require("./stickers");
const { handleGestaoMembros } = require("./gestaoMembros");
const { handleDono } = require("./dono");
const { handleProtecoes } = require("./protecoes");

async function handleMessage(sock, message) {
  const dados = extrairDadosMensagem(message);
  if (!dados) return;

  const { chatId, remetente, texto, isGroup } = dados;

  if (await isBlocked(remetente)) {
    logger.warn(`Mensagem bloqueada de ${remetente} (lista negra).`);
    return;
  }

  // Se for "menu" ou "carta", abre o menu novo (enquete)
  if (texto && (texto.toLowerCase() === "menu" || texto.toLowerCase() === "carta")) {
    await processarCarta(sock, chatId, remetente, isGroup);
    return;
  }

  if (texto && (texto.startsWith("/") || texto.startsWith("!"))) {
    const comando = normalizarTexto(texto.slice(1).split(" ")[0]);

    const permitido = await verificarPermissao(sock, chatId, remetente, comando, isGroup);
    if (!permitido) {
      await sock.sendMessage(chatId, { text: "⛔ Você não tem permissão para usar este comando." });
      return;
    }

    await handleDiversao(sock, message);
    await handleModeracao(sock, message);
    await handleRPG(sock, message);
    await handleAdmin(sock, message);
    await handleResenhas(sock, message);
    await handleGroupManagement(sock, message);
    await handleStickers(sock, message);
    await handleGestaoMembros(sock, message);
    await handleDono(sock, message);
    await handleProtecoes(sock, message);
  }
}

module.exports = { handleMessage };
