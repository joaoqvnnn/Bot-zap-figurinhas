// ==============================================
// LARI MYSTIC BOT - HANDLER DE RPG COMPLETO
// ==============================================

const logger = require("../utils/logger");
const { criarPersonagem, fichaPersonagem, adicionarXP, missaoDiaria, batalha } = require("../services/rpgService");
const { listarLoja, comprarItem, gerarMissao } = require("../services/rpgAvancadoService");

/**
 * Processa comandos de RPG completo.
 */
async function handleRPGCompleto(sock, message) {
  const texto = message.message.conversation || message.message.extendedTextMessage?.text || "";
  const chatId = message.key.remoteJid;
  const remetente = message.key.participant || message.key.remoteJid;

  if (!texto || !texto.startsWith("/") && !texto.startsWith("!")) return;

  const partes = texto.slice(1).split(" ");
  const comando = partes[0].toLowerCase();
  const argumento = partes.slice(1).join(" ");

  switch (comando) {
    case "criarpersonagem":
      await criarPersonagem(sock, chatId, remetente, argumento.trim());
      break;

    case "ficha":
      await fichaPersonagem(sock, chatId, remetente);
      break;

    case "missao":
      await missaoDiaria(sock, chatId, remetente);
      break;

    case "batalha":
      if (!argumento) return sock.sendMessage(chatId, { text: "Uso: /batalha @usuario" });
      const alvo = argumento.replace("@", "").trim();
      await batalha(sock, chatId, remetente, alvo);
      break;

    case "loja":
      const loja = listarLoja();
      await sock.sendMessage(chatId, { text: `🏪 Loja:\n\n${loja}\n\nUse /comprar [item]` });
      break;

    case "comprar":
      if (!argumento) return sock.sendMessage(chatId, { text: "Uso: /comprar pocao" });
      const resultado = comprarItem(remetente, argumento.trim());
      await sock.sendMessage(chatId, { text: resultado });
      break;

    case "missao-nova":
      const missao = gerarMissao();
      await sock.sendMessage(chatId, { text: `📜 Nova missão: ${missao}` });
      break;

    default:
      break;
  }
}

module.exports = { handleRPGCompleto };
