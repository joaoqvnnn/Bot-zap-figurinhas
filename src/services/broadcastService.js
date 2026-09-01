// ==============================================
// LARI MYSTIC BOT - SERVIÇO DE BROADCAST
// ==============================================

const logger = require("../utils/logger");

/**
 * Envia mensagem para uma lista de números.
 * @param {object} sock - Socket do Baileys
 * @param {string[]} numeros - Lista de números (formato internacional)
 * @param {string} texto - Mensagem a enviar
 * @returns {object} Estatísticas de envio
 */
async function enviarBroadcast(sock, numeros, texto) {
  let enviados = 0;
  let falhas = 0;

  for (const numero of numeros) {
    try {
      const jid = numero.includes("@s.whatsapp.net") ? numero : `${numero}@s.whatsapp.net`;
      await sock.sendMessage(jid, { text: texto });
      enviados++;
    } catch (err) {
      falhas++;
      logger.warn(`Falha ao enviar broadcast para ${numero}: ${err.message}`);
    }
    // Pequeno delay para evitar bloqueio
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  return { total: numeros.length, enviados, falhas };
}

module.exports = { enviarBroadcast };
