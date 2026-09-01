// ==============================================
// LARI MYSTIC BOT - HANDLER DE STICKERS E MÍDIA
// ==============================================

const logger = require("../utils/logger");
const { stickerService } = require("../services/stickerService");

/**
 * Processa comandos de criação de stickers e mídia.
 * @param {object} sock - Socket do Baileys
 * @param {object} message - Mensagem do WhatsApp
 */
async function handleStickers(sock, message) {
  const texto = message.message.conversation || message.message.extendedTextMessage?.text || "";
  const chatId = message.key.remoteJid;
  const remetente = message.key.participant || message.key.remoteJid;

  if (!texto.startsWith("/") && !texto.startsWith("!")) return;

  const partes = texto.slice(1).split(" ");
  const comando = partes[0].toLowerCase();
  const argumento = partes.slice(1).join(" ");

  switch (comando) {
    case "s":
    case "sticker":
      // Cria sticker a partir de imagem/vídeo
      if (message.message.imageMessage || message.message.videoMessage) {
        await stickerService.criarStickerDeMidia(sock, message);
      } else {
        await sock.sendMessage(chatId, { text: "Envie uma imagem ou vídeo com legenda /s" });
      }
      break;

    case "ttp":
      // Sticker de texto simples
      if (argumento) {
        await stickerService.criarStickerDeTexto(sock, chatId, argumento, false);
      } else {
        await sock.sendMessage(chatId, { text: "Uso: /ttp Seu texto" });
      }
      break;

    case "attp":
      // Sticker de texto piscante (animado)
      if (argumento) {
        await stickerService.criarStickerDeTexto(sock, chatId, argumento, true);
      } else {
        await sock.sendMessage(chatId, { text: "Uso: /attp Seu texto" });
      }
      break;

    case "togif":
      // Converte vídeo em GIF
      if (message.message.videoMessage) {
        await stickerService.converterVideoParaGif(sock, message);
      } else {
        await sock.sendMessage(chatId, { text: "Envie um vídeo com legenda /togif" });
      }
      break;

    default:
      break;
  }
}

module.exports = { handleStickers };
