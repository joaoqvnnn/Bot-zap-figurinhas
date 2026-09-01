// ==============================================
// LARI MYSTIC BOT - HANDLER ADMINISTRATIVO (DONO)
// ==============================================

const logger = require("../utils/logger");
const { NIVEIS, obterNivelUsuario, validarToken } = require("../menus/permissoes");
const { getUltimosLogs } = require("../services/segurancaService");

/**
 * Processa comandos restritos do dono.
 * @param {object} sock - Socket do Baileys
 * @param {object} message - Mensagem do WhatsApp
 */
async function handleAdmin(sock, message) {
  const texto = message.message.conversation || message.message.extendedTextMessage?.text || "";
  const chatId = message.key.remoteJid;
  const remetente = message.key.participant || message.key.remoteJid;

  if (!texto || !texto.startsWith("/") && !texto.startsWith("!")) return;

  const partes = texto.slice(1).split(" ");
  const comando = partes[0].toLowerCase();
  const argumento = partes.slice(1).join(" ");

  const nivel = await obterNivelUsuario(sock, chatId, remetente);

  // Apenas dono pode usar estes comandos
  if (nivel < NIVEIS.DONO) {
    await sock.sendMessage(chatId, { text: "⛔ Acesso negado. Comando exclusivo do dono." });
    return;
  }

  switch (comando) {
    case "token":
      // Gera um novo token (em produção, atualizar no banco)
      const novoTtoken = Math.random().toString(36).substring(2, 10).toUpperCase();
      await sock.sendMessage(chatId, { text: `🔑 Novo token gerado: ${novoTtoken}` });
      break;

    case "modo-manutencao":
      // Placeholder
      await sock.sendMessage(chatId, { text: "🔧 Modo manutenção ativado/desativado (placeholder)." });
      break;

    case "zerar-tudo":
      // Placeholder perigoso
      await sock.sendMessage(chatId, { text: "⚠️ Zerar tudo ainda não implementado." });
      break;

    case "ver-logs":
      const logs = await getUltimosLogs(20);
      if (logs.length === 0) {
        await sock.sendMessage(chatId, { text: "📋 Nenhum log registrado." });
      } else {
        let msgLogs = "📋 Últimos logs:\n\n";
        logs.forEach((log) => {
          msgLogs += `[${log.timestamp}] ${log.acao}\n`;
        });
        await sock.sendMessage(chatId, { text: msgLogs });
      }
      break;

    case "broadcast":
      if (!argumento) {
        await sock.sendMessage(chatId, { text: "Uso: /broadcast mensagem para todos os grupos." });
        return;
      }
      // Placeholder – implementar envio para todos os grupos
      await sock.sendMessage(chatId, { text: "📢 Broadcast enviado (placeholder)." });
      break;

    default:
      break;
  }
}

module.exports = { handleAdmin };
