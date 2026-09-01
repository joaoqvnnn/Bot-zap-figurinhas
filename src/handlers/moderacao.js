// ==============================================
// LARI MYSTIC BOT - HANDLER DE MODERAÇÃO
// ==============================================

const logger = require("../utils/logger");
const { NIVEIS, obterNivelUsuario, verificarPermissao } = require("../menus/permissoes");
const { extrairNumero, limparNumero } = require("../utils/helpers");
const { adicionarListaNegra, removerListaNegra, getListaNegra, ativarProtecao, desativarProtecao, getProtecoesAtivas } = require("../services/segurancaService");

/**
 * Processa comandos de moderação e segurança.
 * @param {object} sock - Socket do Baileys
 * @param {object} message - Mensagem do WhatsApp
 */
async function handleModeracao(sock, message) {
  const texto = message.message.conversation || message.message.extendedTextMessage?.text || "";
  const chatId = message.key.remoteJid;
  const remetente = message.key.participant || message.key.remoteJid;
  const isGroup = chatId.endsWith("@g.us");

  if (!texto || !texto.startsWith("/") && !texto.startsWith("!")) return;

  const partes = texto.slice(1).split(" ");
  const comando = partes[0].toLowerCase();
  const argumento = partes.slice(1).join(" ");

  // Verifica se o usuário tem permissão para moderar
  const nivel = await obterNivelUsuario(sock, chatId, remetente);
  if (nivel < NIVEIS.MODERADOR && comando !== "listanegra") {
    await sock.sendMessage(chatId, { text: "⛔ Você não tem permissão para moderar." });
    return;
  }

  switch (comando) {
    case "ban":
      if (!argumento) {
        await sock.sendMessage(chatId, { text: "Uso: /ban @usuario" });
        return;
      }
      // Extrai número mencionado ou argumento
      const alvoBan = extrairNumero(argumento) || argumento;
      await adicionarListaNegra(alvoBan);
      await sock.sendMessage(chatId, { text: `🔨 Usuário ${alvoBan} banido globalmente.` });
      break;

    case "unban":
      if (!argumento) {
        await sock.sendMessage(chatId, { text: "Uso: /unban @usuario" });
        return;
      }
      const alvoUnban = extrairNumero(argumento) || argumento;
      await removerListaNegra(alvoUnban);
      await sock.sendMessage(chatId, { text: `🔓 Usuário ${alvoUnban} removido da lista negra.` });
      break;

    case "listanegra":
      const lista = await getListaNegra();
      if (lista.length === 0) {
        await sock.sendMessage(chatId, { text: "📋 Lista negra vazia." });
      } else {
        await sock.sendMessage(chatId, { text: `📋 Lista negra global:\n\n${lista.join("\n")}` });
      }
      break;

    case "ativar":
      if (!argumento) {
        await sock.sendMessage(chatId, { text: "Uso: /ativar anti-link, anti-flood, etc." });
        return;
      }
      await ativarProtecao(chatId, argumento.toLowerCase(), true);
      await sock.sendMessage(chatId, { text: `✅ Proteção '${argumento}' ativada.` });
      break;

    case "desativar":
      if (!argumento) {
        await sock.sendMessage(chatId, { text: "Uso: /desativar anti-link, anti-flood, etc." });
        return;
      }
      await desativarProtecao(chatId, argumento.toLowerCase());
      await sock.sendMessage(chatId, { text: `❌ Proteção '${argumento}' desativada.` });
      break;

    case "protecoes":
      const ativas = await getProtecoesAtivas(chatId);
      if (ativas.length === 0) {
        await sock.sendMessage(chatId, { text: "Nenhuma proteção ativa." });
      } else {
        await sock.sendMessage(chatId, { text: `🛡️ Proteções ativas:\n\n${ativas.join("\n")}` });
      }
      break;

    default:
      // Comando não reconhecido na moderação
      break;
  }
}

module.exports = { handleModeracao };
