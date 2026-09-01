// ==============================================
// LARI MYSTIC BOT - HANDLER DE BROADCAST
// ==============================================

const logger = require("../utils/logger");
const { NIVEIS, obterNivelUsuario } = require("../menus/permissoes");
const { enviarBroadcast } = require("../services/broadcastService");

/**
 * Processa comando de broadcast (apenas dono).
 */
async function handleBroadcast(sock, message) {
  const texto = message.message.conversation || message.message.extendedTextMessage?.text || "";
  const chatId = message.key.remoteJid;
  const remetente = message.key.participant || message.key.remoteJid;

  if (!texto || !texto.startsWith("/") && !texto.startsWith("!")) return;

  const partes = texto.slice(1).split(" ");
  const comando = partes[0].toLowerCase();
  const argumento = partes.slice(1).join(" ");

  if (comando !== "broadcast") return;

  const nivel = await obterNivelUsuario(sock, chatId, remetente);
  if (nivel < NIVEIS.DONO) {
    await sock.sendMessage(chatId, { text: "⛔ Apenas o dono pode usar broadcast." });
    return;
  }

  if (!argumento) {
    await sock.sendMessage(chatId, { text: "Uso: /broadcast mensagem" });
    return;
  }

  // Obtém lista de números únicos de todos os grupos
  // Placeholder: buscar do banco/grupos
  const numeros = []; // implementar coleta real
  const resultado = await enviarBroadcast(sock, numeros, argumento);
  await sock.sendMessage(chatId, {
    text: `📢 Broadcast concluído!\nTotal: ${resultado.total}\nEnviados: ${resultado.enviados}\nFalhas: ${resultado.falhas}`
  });
}

module.exports = { handleBroadcast };
