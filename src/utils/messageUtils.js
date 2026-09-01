// ==============================================
// LARI MYSTIC BOT - UTILITÁRIOS DE MENSAGEM
// ==============================================

const logger = require("../utils/logger");

/**
 * Envia uma mensagem com botões interativos (se suportado).
 * Caso contrário, envia texto puro.
 * @param {object} sock - Socket do Baileys
 * @param {string} chatId - Destinatário
 * @param {string} texto - Texto da mensagem
 * @param {Array} botoes - Lista de botões {id, texto}
 */
async function enviarMensagemInterativa(sock, chatId, texto, botoes = []) {
  try {
    if (botoes.length > 0) {
      const buttons = botoes.map((botao, index) => ({
        buttonId: botao.id || `btn_${index}`,
        buttonText: { displayText: botao.texto },
        type: 1,
      }));

      await sock.sendMessage(chatId, {
        text: texto,
        buttons,
        headerType: 1,
      });
      return true;
    }
  } catch (err) {
    logger.warn("Falha ao enviar botões interativos, usando texto puro.");
  }

  // Fallback: envia apenas texto
  await sock.sendMessage(chatId, { text: texto });
  return true;
}

/**
 * Envia uma mensagem de erro padrão.
 */
async function enviarErro(sock, chatId, motivo = "Ocorreu um erro.") {
  await sock.sendMessage(chatId, { text: `❌ ${motivo}` });
}

/**
 * Envia uma mensagem de sucesso padrão.
 */
async function enviarSucesso(sock, chatId, detalhe = "Operação realizada.") {
  await sock.sendMessage(chatId, { text: `✅ ${detalhe}` });
}

module.exports = {
  enviarMensagemInterativa,
  enviarErro,
  enviarSucesso,
};
