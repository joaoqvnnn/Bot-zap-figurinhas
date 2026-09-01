// ==============================================
// LARI MYSTIC BOT - MENUS SECUNDÁRIOS
// ==============================================

const logger = require("../utils/logger");

/**
 * Exibe o menu de diversão.
 * @param {object} sock
 * @param {string} chatId
 */
async function menuDiversao(sock, chatId) {
  const texto = "🎭 *Menu Diversão*\n\n" +
    "1. 🎮 Jogos\n" +
    "2. 🤖 IA\n" +
    "3. 🎨 Stickers\n\n" +
    "Responda com o número.";

  await sock.sendMessage(chatId, { text: texto });
}

/**
 * Exibe o menu de proteções.
 */
async function menuProtecoes(sock, chatId) {
  const texto = "🛡️ *Menu Proteções*\n\n" +
    "1. Ativar proteção\n" +
    "2. Desativar proteção\n" +
    "3. Ver proteções ativas\n" +
    "4. Lista negra\n\n" +
    "Responda com o número.";

  await sock.sendMessage(chatId, { text: texto });
}

/**
 * Exibe o menu de RPG.
 */
async function menuRPG(sock, chatId) {
  const texto = "⚔️ *Menu RPG*\n\n" +
    "1. Criar personagem\n" +
    "2. Ficha\n" +
    "3. Missão\n" +
    "4. Batalha\n" +
    "5. Loja\n\n" +
    "Responda com o número.";

  await sock.sendMessage(chatId, { text: texto });
}

/**
 * Exibe o menu de moderação.
 */
async function menuModeracao(sock, chatId) {
  const texto = "🔨 *Menu Moderação*\n\n" +
    "1. Banir\n" +
    "2. Silenciar\n" +
    "3. Promover\n" +
    "4. Moderadores\n\n" +
    "Responda com o número.";

  await sock.sendMessage(chatId, { text: texto });
}

module.exports = {
  menuDiversao,
  menuProtecoes,
  menuRPG,
  menuModeracao,
};
