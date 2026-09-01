// ==============================================
// LARI MYSTIC BOT - HANDLER DE GESTÃO DE MEMBROS
// ==============================================

const logger = require("../utils/logger");
const { NIVEIS, obterNivelUsuario } = require("../menus/permissoes");
const { extrairNumero } = require("../utils/helpers");
const {
  adicionarModerador,
  removerModerador,
  concederPermissao,
  revogarPermissao,
  listarModeradores,
  listarPermissoes,
} = require("../services/membroService");

/**
 * Processa comandos de gestão de membros (promover, rebaixar, moderadores, etc.).
 */
async function handleGestaoMembros(sock, message) {
  const texto = message.message.conversation || message.message.extendedTextMessage?.text || "";
  const chatId = message.key.remoteJid;
  const remetente = message.key.participant || message.key.remoteJid;

  if (!texto || !texto.startsWith("/") && !texto.startsWith("!")) return;

  const partes = texto.slice(1).split(" ");
  const comando = partes[0].toLowerCase();
  const argumento = partes.slice(1).join(" ");

  const nivel = await obterNivelUsuario(sock, chatId, remetente);
  if (nivel < NIVEIS.ADMIN) {
    await sock.sendMessage(chatId, { text: "⛔ Apenas administradores podem gerenciar membros." });
    return;
  }

  switch (comando) {
    case "promover":
      if (!argumento) return sock.sendMessage(chatId, { text: "Uso: /promover @usuario" });
      const alvoPromover = extrairNumero(argumento);
      try {
        await sock.groupParticipantsUpdate(chatId, [alvoPromover], "promote");
        await sock.sendMessage(chatId, { text: `👑 Usuário promovido a admin.` });
      } catch (err) {
        await sock.sendMessage(chatId, { text: `❌ Erro ao promover: ${err.message}` });
      }
      break;

    case "rebaixar":
      if (!argumento) return sock.sendMessage(chatId, { text: "Uso: /rebaixar @usuario" });
      const alvoRebaixar = extrairNumero(argumento);
      try {
        await sock.groupParticipantsUpdate(chatId, [alvoRebaixar], "demote");
        await sock.sendMessage(chatId, { text: `⬇️ Usuário rebaixado de admin.` });
      } catch (err) {
        await sock.sendMessage(chatId, { text: `❌ Erro ao rebaixar: ${err.message}` });
      }
      break;

    case "addmod":
      if (!argumento) return sock.sendMessage(chatId, { text: "Uso: /addmod @usuario" });
      const alvoAddMod = extrairNumero(argumento);
      if (adicionarModerador(chatId, alvoAddMod)) {
        await sock.sendMessage(chatId, { text: `🛡️ Moderador adicionado.` });
      } else {
        await sock.sendMessage(chatId, { text: `⚠️ Usuário já é moderador.` });
      }
      break;

    case "delmod":
      if (!argumento) return sock.sendMessage(chatId, { text: "Uso: /delmod @usuario" });
      const alvoDelMod = extrairNumero(argumento);
      if (removerModerador(chatId, alvoDelMod)) {
        await sock.sendMessage(chatId, { text: `🗑️ Moderador removido.` });
      } else {
        await sock.sendMessage(chatId, { text: `❌ Usuário não é moderador.` });
      }
      break;

    case "listmods":
      const mods = listarModeradores(chatId);
      await sock.sendMessage(chatId, {
        text: mods.length ? `📋 Moderadores:\n\n${mods.join("\n")}` : "Nenhum moderador cadastrado."
      });
      break;

    case "grantmodcmd":
      // Formato: /grantmodcmd @usuario comando
      const [userGrant, cmdGrant] = argumento.split(" ");
      if (!userGrant || !cmdGrant) return sock.sendMessage(chatId, { text: "Uso: /grantmodcmd @usuario comando" });
      const alvoGrant = extrairNumero(userGrant);
      if (concederPermissao(chatId, alvoGrant, cmdGrant)) {
        await sock.sendMessage(chatId, { text: `✅ Permissão '${cmdGrant}' concedida.` });
      } else {
        await sock.sendMessage(chatId, { text: `❌ Não foi possível conceder.` });
      }
      break;

    case "revokemodcmd":
      const [userRevoke, cmdRevoke] = argumento.split(" ");
      if (!userRevoke || !cmdRevoke) return sock.sendMessage(chatId, { text: "Uso: /revokemodcmd @usuario comando" });
      const alvoRevoke = extrairNumero(userRevoke);
      if (revogarPermissao(chatId, alvoRevoke, cmdRevoke)) {
        await sock.sendMessage(chatId, { text: `❌ Permissão '${cmdRevoke}' revogada.` });
      } else {
        await sock.sendMessage(chatId, { text: `❌ Não foi possível revogar.` });
      }
      break;

    case "listmodcmds":
      const [userPerms] = argumento.split(" ");
      if (!userPerms) return sock.sendMessage(chatId, { text: "Uso: /listmodcmds @usuario" });
      const alvoPerms = extrairNumero(userPerms);
      const perms = listarPermissoes(chatId, alvoPerms);
      await sock.sendMessage(chatId, {
        text: perms.length ? `📋 Permissões:\n\n${perms.join("\n")}` : "Nenhuma permissão especial."
      });
      break;

    default:
      break;
  }
}

module.exports = { handleGestaoMembros };
