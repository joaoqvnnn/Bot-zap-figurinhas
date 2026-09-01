// ==============================================
// LARI MYSTIC BOT - HANDLER DO DONO
// ==============================================

const logger = require("../utils/logger");
const { NIVEIS, obterNivelUsuario } = require("../menus/permissoes");
const { getUltimosLogs } = require("../services/logService");
const { setModoManutencao, isModoManutencao } = require("../services/donoService");
const { enviarBroadcast } = require("../services/broadcastService");
const config = require("../config");

/**
 * Processa comandos exclusivos do dono.
 */
async function handleDono(sock, message) {
  const texto = message.message.conversation || message.message.extendedTextMessage?.text || "";
  const chatId = message.key.remoteJid;
  const remetente = message.key.participant || message.key.remoteJid;

  if (!texto || !texto.startsWith("/") && !texto.startsWith("!")) return;

  const partes = texto.slice(1).split(" ");
  const comando = partes[0].toLowerCase();
  const argumento = partes.slice(1).join(" ");

  const nivel = await obterNivelUsuario(sock, chatId, remetente);
  if (nivel < NIVEIS.DONO) {
    await sock.sendMessage(chatId, { text: "⛔ Comando exclusivo do dono." });
    return;
  }

  switch (comando) {
    case "token":
      const novoTtoken = Math.random().toString(36).substring(2, 10).toUpperCase();
      await sock.sendMessage(chatId, { text: `🔑 Novo token: ${novoTtoken}` });
      break;

    case "modomanutencao":
      setModoManutencao(!isModoManutencao());
      await sock.sendMessage(chatId, { text: `🔧 Modo manutenção ${isModoManutencao() ? "ativado" : "desativado"}.` });
      break;

    case "zerartudo":
      await sock.sendMessage(chatId, { text: "⚠️ Zerar tudo ainda não implementado." });
      break;

    case "verlogs":
      const logs = getUltimosLogs(20);
      if (logs.length === 0) return sock.sendMessage(chatId, { text: "📋 Nenhum log." });
      let msgLogs = "📋 Últimos logs:\n\n";
      logs.forEach(log => {
        msgLogs += `[${log.timestamp}] ${log.acao}\n`;
      });
      await sock.sendMessage(chatId, { text: msgLogs });
      break;

    case "broadcast":
      if (!argumento) return sock.sendMessage(chatId, { text: "Uso: /broadcast mensagem" });
      const numeros = []; // placeholder: coletar do banco
      const resultado = await enviarBroadcast(sock, numeros, argumento);
      await sock.sendMessage(chatId, { text: `📢 Broadcast: ${resultado.enviados} enviados, ${resultado.falhas} falhas.` });
      break;

    case "comandosecreto":
      await sock.sendMessage(chatId, { text: "🥚 Easter egg ativado!" });
      break;

    default:
      break;
  }
}

module.exports = { handleDono };
