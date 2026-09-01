// ==============================================
// LARI MYSTIC BOT - HANDLER DE INTELIGÊNCIA ARTIFICIAL
// ==============================================

const logger = require("../utils/logger");
const {
  conversarComIA,
  gerarImagemIA,
  traduzirTexto,
  resumirTexto,
} = require("../services/openaiService");

/**
 * Processa comandos de IA.
 */
async function handleIA(sock, message) {
  const texto = message.message.conversation || message.message.extendedTextMessage?.text || "";
  const chatId = message.key.remoteJid;

  if (!texto || !texto.startsWith("/") && !texto.startsWith("!")) return;

  const partes = texto.slice(1).split(" ");
  const comando = partes[0].toLowerCase();
  const argumento = partes.slice(1).join(" ");

  switch (comando) {
    case "ia":
      if (!argumento) return sock.sendMessage(chatId, { text: "Digite algo. Ex: /ia Qual a capital do Brasil?" });
      const resposta = await conversarComIA(argumento);
      await sock.sendMessage(chatId, { text: resposta });
      break;

    case "imagine":
      if (!argumento) return sock.sendMessage(chatId, { text: "Descreva a imagem. Ex: /imagine um gato astronauta" });
      const urlImagem = await gerarImagemIA(argumento);
      if (urlImagem.startsWith("http")) {
        await sock.sendMessage(chatId, { image: { url: urlImagem }, caption: "✨ Imagem gerada por IA" });
      } else {
        await sock.sendMessage(chatId, { text: urlImagem });
      }
      break;

    case "traduzir":
      if (!argumento) return sock.sendMessage(chatId, { text: "Digite o texto para traduzir." });
      const traducao = await traduzirTexto(argumento);
      await sock.sendMessage(chatId, { text: traducao });
      break;

    case "resumir":
      if (!argumento) return sock.sendMessage(chatId, { text: "Digite o texto para resumir." });
      const resumo = await resumirTexto(argumento);
      await sock.sendMessage(chatId, { text: resumo });
      break;

    default:
      break;
  }
}

module.exports = { handleIA };
