// ==============================================
// LARI MYSTIC BOT - HANDLER DE GESTÃO DE GRUPO
// ==============================================

const logger = require("../utils/logger");
const { NIVEIS, obterNivelUsuario } = require("../menus/permissoes");
const { groupService } = require("../services/groupService");

/**
 * Processa comandos de gestão de grupo (admin).
 * @param {object} sock - Socket do Baileys
 * @param {object} message - Mensagem do WhatsApp
 */
async function handleGroupManagement(sock, message) {
  const texto = message.message.conversation || message.message.extendedTextMessage?.text || "";
  const chatId = message.key.remoteJid;
  const remetente = message.key.participant || message.key.remoteJid;
  const isGroup = chatId.endsWith("@g.us");

  if (!isGroup || !texto.startsWith("/") && !texto.startsWith("!")) return;

  const partes = texto.slice(1).split(" ");
  const comando = partes[0].toLowerCase();
  const argumento = partes.slice(1).join(" ");

  const nivel = await obterNivelUsuario(sock, chatId, remetente);
  if (nivel < NIVEIS.ADMIN) {
    await sock.sendMessage(chatId, { text: "⛔ Apenas administradores podem gerenciar o grupo." });
    return;
  }

  switch (comando) {
    case "setname":
      if (!argumento) {
        await sock.sendMessage(chatId, { text: "Uso: /setname Novo nome do grupo" });
        return;
      }
      await groupService.mudarNomeGrupo(sock, chatId, argumento);
      break;

    case "setdesc":
      if (!argumento) {
        await sock.sendMessage(chatId, { text: "Uso: /setdesc Nova descrição" });
        return;
      }
      await groupService.mudarDescricaoGrupo(sock, chatId, argumento);
      break;

    case "linkgp":
      const link = await groupService.obterLinkGrupo(sock, chatId);
      if (link) {
        await sock.sendMessage(chatId, { text: `🔗 Link do grupo:\n${link}` });
      } else {
        await sock.sendMessage(chatId, { text: "❌ Não foi possível obter o link." });
      }
      break;

    case "grupo":
      if (argumento.toLowerCase() === "a") {
        await groupService.abrirGrupo(sock, chatId);
        await sock.sendMessage(chatId, { text: "✅ Grupo aberto para novos membros." });
      } else if (argumento.toLowerCase() === "f") {
        await groupService.fecharGrupo(sock, chatId);
        await sock.sendMessage(chatId, { text: "🔒 Grupo fechado para novos membros." });
      } else {
        await sock.sendMessage(chatId, { text: "Uso: /grupo A (abrir) ou /grupo F (fechar)" });
      }
      break;

    default:
      break;
  }
}

module.exports = { handleGroupManagement };
