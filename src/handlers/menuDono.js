// ==============================================
// LARI MYSTIC BOT - MENU INTERATIVO DO DONO
// ==============================================

const logger = require("../utils/logger");
const { NIVEIS, obterNivelUsuario } = require("../menus/permissoes");

/**
 * Exibe o menu interativo do dono.
 * @param {object} sock - Socket do Baileys
 * @param {string} chatId
 * @param {string} remetente
 */
async function mostrarMenuDono(sock, chatId, remetente) {
  const nivel = await obterNivelUsuario(sock, chatId, remetente);
  if (nivel < NIVEIS.DONO) {
    await sock.sendMessage(chatId, { text: "⛔ Acesso negado." });
    return;
  }

  const texto = "👑 *Menu do Dono*\n\n" +
    "Escolha uma opção:\n" +
    "1. 🔑 Gerar Token\n" +
    "2. 🔧 Modo Manutenção\n" +
    "3. 📋 Ver Logs\n" +
    "4. 📢 Broadcast\n" +
    "5. 🔥 Zerar Tudo\n" +
    "6. 🥚 Comando Secreto\n\n" +
    "Responda com o número da opção.";

  await sock.sendMessage(chatId, { text: texto });
}

module.exports = { mostrarMenuDono };
