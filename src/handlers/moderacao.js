// ==============================================
// LARI MYSTIC BOT - HANDLER DE MODERAÇÃO ATUALIZADO
// ==============================================

const logger = require("../utils/logger");
const { NIVEIS, obterNivelUsuario } = require("../menus/permissoes");
const { extrairNumero, limparNumero } = require("../utils/helpers");
const { adicionarListaNegra, removerListaNegra, getListaNegra } = require("../services/listaNegraService");
const { silenciarUsuario, dessilenciarUsuario, isSilenciado } = require("../services/moderationService");
const { ativarProtecao, desativarProtecao, getProtecoesAtivas } = require("../services/segurancaService");

/**
 * Processa comandos de moderação.
 */
async function handleModeracao(sock, message) {
  const texto = message.message.conversation || message.message.extendedTextMessage?.text || "";
  const chatId = message.key.remoteJid;
  const remetente = message.key.participant || message.key.remoteJid;

  if (!texto || !texto.startsWith("/") && !texto.startsWith("!")) return;

  const partes = texto.slice(1).split(" ");
  const comando = partes[0].toLowerCase();
  const argumento = partes.slice(1).join(" ");

  const nivel = await obterNivelUsuario(sock, chatId, remetente);
  if (nivel < NIVEIS.MODERADOR) {
    await sock.sendMessage(chatId, { text: "⛔ Você não tem permissão para moderar." });
    return;
  }

  switch (comando) {
    case "ban":
      if (!argumento) return sock.sendMessage(chatId, { text: "Uso: /ban @usuario" });
      const alvoBan = extrairNumero(argumento) || argumento;
      await adicionarListaNegra(alvoBan);
      await sock.sendMessage(chatId, { text: `🔨 Usuário ${alvoBan} banido globalmente.` });
      break;

    case "unban":
      if (!argumento) return sock.sendMessage(chatId, { text: "Uso: /unban @usuario" });
      const alvoUnban = extrairNumero(argumento) || argumento;
      await removerListaNegra(alvoUnban);
      await sock.sendMessage(chatId, { text: `🔓 Usuário ${alvoUnban} removido da lista negra.` });
      break;

    case "listanegra":
      const lista = await getListaNegra();
      await sock.sendMessage(chatId, {
        text: lista.length ? `📋 Lista negra:\n\n${lista.join("\n")}` : "📋 Lista negra vazia."
      });
      break;

    case "mute":
      if (!argumento) return sock.sendMessage(chatId, { text: "Uso: /mute @usuario [minutos]" });
      const [alvoMute, minutosStr] = argumento.split(" ");
      const alvoMuteNum = extrairNumero(alvoMute) || alvoMute;
      const minutos = parseInt(minutosStr) || 5;
      silenciarUsuario(alvoMuteNum, minutos);
      await sock.sendMessage(chatId, { text: `🔇 Usuário ${alvoMuteNum} silenciado por ${minutos} min.` });
      break;

    case "desmute":
      if (!argumento) return sock.sendMessage(chatId, { text: "Uso: /desmute @usuario" });
      const alvoDesmute = extrairNumero(argumento) || argumento;
      dessilenciarUsuario(alvoDesmute);
      await sock.sendMessage(chatId, { text: `🔊 Usuário ${alvoDesmute} desmutado.` });
      break;

    case "ativar":
      if (!argumento) return sock.sendMessage(chatId, { text: "Uso: /ativar anti-link, anti-flood, etc." });
      await ativarProtecao(chatId, argumento.toLowerCase(), true);
      await sock.sendMessage(chatId, { text: `✅ Proteção '${argumento}' ativada.` });
      break;

    case "desativar":
      if (!argumento) return sock.sendMessage(chatId, { text: "Uso: /desativar anti-link, anti-flood, etc." });
      await desativarProtecao(chatId, argumento.toLowerCase());
      await sock.sendMessage(chatId, { text: `❌ Proteção '${argumento}' desativada.` });
      break;

    case "protecoes":
      const ativas = await getProtecoesAtivas(chatId);
      await sock.sendMessage(chatId, {
        text: ativas.length ? `🛡️ Proteções ativas:\n\n${ativas.join("\n")}` : "Nenhuma proteção ativa."
      });
      break;

    default:
      break;
  }
}

module.exports = { handleModeracao };
