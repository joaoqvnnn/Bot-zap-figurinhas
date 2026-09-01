// ==============================================
// LARI MYSTIC BOT - SERVIÇO DE STICKERS
// ==============================================

const logger = require("../utils/logger");
const sharp = require("sharp");
const { downloadMediaMessage } = require("@whiskeysockets/baileys");

/**
 * Funções para criação de stickers e conversão de mídia.
 */
const stickerService = {
  /**
   * Cria um sticker a partir de uma imagem ou vídeo enviada.
   */
  async criarStickerDeMidia(sock, message) {
    try {
      const buffer = await downloadMediaMessage(
        message,
        "buffer",
        {},
        { logger: pino({ level: "silent" }) }
      );

      // Converte para webp (formato de sticker)
      const webpBuffer = await sharp(buffer)
        .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .webp()
        .toBuffer();

      await sock.sendMessage(message.key.remoteJid, {
        sticker: webpBuffer,
      });
      logger.info("Sticker criado a partir de mídia.");
      return true;
    } catch (err) {
      logger.error(`Erro ao criar sticker de mídia: ${err.message}`);
      return false;
    }
  },

  /**
   * Cria um sticker a partir de texto.
   */
  async criarStickerDeTexto(sock, chatId, texto, animado = false) {
    try {
      // Gera uma imagem com o texto usando SVG e sharp
      const svg = `
        <svg width="512" height="512">
          <rect width="100%" height="100%" fill="black" />
          <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
                fill="white" font-size="48" font-family="Arial" font-weight="bold">
            ${texto}
          </text>
        </svg>`;

      const buffer = Buffer.from(svg);
      const webpBuffer = await sharp(buffer)
        .webp()
        .toBuffer();

      await sock.sendMessage(chatId, {
        sticker: webpBuffer,
      });
      logger.info("Sticker de texto criado.");
      return true;
    } catch (err) {
      logger.error(`Erro ao criar sticker de texto: ${err.message}`);
      return false;
    }
  },

  /**
   * Converte vídeo em GIF.
   */
  async converterVideoParaGif(sock, message) {
    try {
      const buffer = await downloadMediaMessage(
        message,
        "buffer",
        {},
        { logger: pino({ level: "silent" }) }
      );

      // Converte vídeo para GIF (simplificado; pode ser pesado)
      const gifBuffer = await sharp(buffer, { animated: true })
        .gif()
        .toBuffer();

      await sock.sendMessage(message.key.remoteJid, {
        video: gifBuffer,
        gifPlayback: true,
      });
      logger.info("Vídeo convertido para GIF.");
      return true;
    } catch (err) {
      logger.error(`Erro ao converter vídeo para GIF: ${err.message}`);
      return false;
    }
  },
};

module.exports = { stickerService };
