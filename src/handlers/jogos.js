// ==============================================
// LARI MYSTIC BOT - HANDLER DE JOGOS
// ==============================================

const logger = require("../utils/logger");
const { iniciarForca, tentarLetraForca, iniciarQuiz, responderQuiz } = require("../services/jogosAvancadosService");
const { jogoDados, jogoCaraOuCoroa, jogoPedraPapelTesoura, jogoAnagrama, processarRespostaJogo } = require("../services/jogoService");

/**
 * Processa comandos de jogos.
 */
async function handleJogos(sock, message) {
  const texto = message.message.conversation || message.message.extendedTextMessage?.text || "";
  const chatId = message.key.remoteJid;
  const remetente = message.key.participant || message.key.remoteJid;

  if (!texto || !texto.startsWith("/") && !texto.startsWith("!")) return;

  const partes = texto.slice(1).split(" ");
  const comando = partes[0].toLowerCase();
  const argumento = partes.slice(1).join(" ");

  switch (comando) {
    case "dados":
      await jogoDados(sock, chatId, remetente);
      break;

    case "caraoucoroa":
      await jogoCaraOuCoroa(sock, chatId, remetente);
      break;

    case "ppt":
      await sock.sendMessage(chatId, { text: "Escolha: pedra, papel ou tesoura?" });
      break;

    case "anagrama":
      await jogoAnagrama(sock, chatId, remetente);
      break;

    case "forca":
      const tamanho = iniciarForca(chatId, remetente);
      await sock.sendMessage(chatId, { text: `🎯 Jogo da forca iniciado! A palavra tem ${tamanho} letras. Envie /letra X para tentar.` });
      break;

    case "letra":
      if (!argumento) return sock.sendMessage(chatId, { text: "Uso: /letra a" });
      const resultado = tentarLetraForca(chatId, argumento.trim());
      if (!resultado) return sock.sendMessage(chatId, { text: "Não há jogo da forca ativo." });
      if (resultado === "repetida") return sock.sendMessage(chatId, { text: "⚠️ Você já tentou essa letra." });
      if (resultado.resultado === "venceu") return sock.sendMessage(chatId, { text: `🎉 Você venceu! Palavra: ${resultado.palavra}` });
      if (resultado.resultado === "perdeu") return sock.sendMessage(chatId, { text: `😞 Você perdeu! Palavra era: ${resultado.palavra}` });
      if (resultado.resultado === "acertou") return sock.sendMessage(chatId, { text: `✅ Palavra: ${resultado.palavraOculta}` });
      if (resultado.resultado === "errou") return sock.sendMessage(chatId, { text: `❌ Errou! ${resultado.erros}/${resultado.maxErros}` });
      break;

    case "quiz":
      const pergunta = iniciarQuiz(chatId);
      await sock.sendMessage(chatId, { text: `❓ ${pergunta}` });
      break;

    case "responder":
      if (!argumento) return sock.sendMessage(chatId, { text: "Uso: /responder resposta" });
      const acertou = responderQuiz(chatId, argumento);
      if (acertou === null) return sock.sendMessage(chatId, { text: "Nenhum quiz ativo." });
      await sock.sendMessage(chatId, { text: acertou ? "✅ Resposta correta!" : "❌ Resposta errada." });
      break;

    default:
      // Verifica resposta de jogo de anagrama ou ppt
      await processarRespostaJogo(sock, chatId, remetente, texto);
      break;
  }
}

module.exports = { handleJogos };
