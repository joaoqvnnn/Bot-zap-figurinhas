// ==============================================
// LARI MYSTIC BOT - HANDLER DE RPG
// ==============================================

const logger = require("../utils/logger");
const { NIVEIS, obterNivelUsuario } = require("../menus/permissoes");
const { extrairNumero } = require("../utils/helpers");
const {
  criarPersonagem,
  fichaPersonagem,
  adicionarXP,
  missaoDiaria,
  batalha,
} = require("../services/rpgService");

/**
 * Processa comandos de RPG.
 * @param {object} sock - Socket do Baileys
 * @param {object} message - Mensagem do WhatsApp
 */
async function handleRPG(sock, message) {
  const texto = message.message.conversation || message.message.extendedTextMessage?.text || "";
  const chatId = message.key.remoteJid;
  const remetente = message.key.participant || message.key.remoteJid;

  if (!texto || !texto.startsWith("/") && !texto.startsWith("!")) return;

  const partes = texto.slice(1).split(" ");
  const comando = partes[0].toLowerCase();
  const argumento = partes.slice(1).join(" ");

  switch (comando) {
    case "criarpersonagem":
    case "criar-personagem":
      await criarPersonagem(sock, chatId, remetente, argumento.trim());
      break;

    case "ficha":
    case "personagem":
      await fichaPersonagem(sock, chatId, remetente);
      break;

    case "missao":
      await missaoDiaria(sock, chatId, remetente);
      break;

    case "batalha":
      if (!argumento) {
        await sock.sendMessage(chatId, { text: "Uso: /batalha @usuario" });
        return;
      }
      const alvoId = extrairNumero(argumento);
      if (!alvoId) {
        await sock.sendMessage(chatId, { text: "Usuário inválido." });
        return;
      }
      await batalha(sock, chatId, remetente, alvoId);
      break;

    case "evoluir":
    case "xp":
      const xpGanho = Math.floor(Math.random() * 30) + 10;
      await adicionarXP(sock, chatId, remetente, xpGanho);
      break;

    default:
      break;
  }
}

module.exports = { handleRPG };
