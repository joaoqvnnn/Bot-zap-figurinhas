// ==============================================
// LARI MYSTIC BOT - HANDLER DE DIVERSÃO
// ==============================================

const logger = require("../utils/logger");
const { jogoDados, jogoCaraOuCoroa, jogoPedraPapelTesoura, jogoAnagrama, processarRespostaJogo } = require("../services/jogoService");
const { conversarComIA, gerarImagemIA, traduzirTexto, resumirTexto } = require("../services/iaService");

/**
 * Processa comandos de diversão e jogos.
 * @param {object} sock - Socket do Baileys
 * @param {object} message - Mensagem do WhatsApp
 */
async function handleDiversao(sock, message) {
  const texto = message.message.conversation || message.message.extendedTextMessage?.text || "";
  const chatId = message.key.remoteJid;
  const remetente = message.key.participant || message.key.remoteJid;

  const comando = texto.toLowerCase().split(" ")[0];

  switch (comando) {
    case "!dados":
    case "/dados":
      await jogoDados(sock, chatId, remetente);
      break;

    case "!caraoucoroa":
    case "/caraoucoroa":
      await jogoCaraOuCoroa(sock, chatId, remetente);
      break;

    case "!ppt":
    case "/ppt":
    case "!pedrapapeltesoura":
    case "/pedrapapeltesoura":
      await sock.sendMessage(chatId, { text: "Escolha: pedra, papel ou tesoura?" });
      // A resposta será processada em messageHandler
      break;

    case "!anagrama":
    case "/anagrama":
      await jogoAnagrama(sock, chatId, remetente);
      break;

    case "!ia":
    case "/ia":
      const prompt = texto.replace(/^(\/|!)ia\s*/i, "").trim();
      if (!prompt) {
        await sock.sendMessage(chatId, { text: "Digite algo para eu responder. Ex: !ia Qual a capital do Brasil?" });
        return;
      }
      const respostaIA = await conversarComIA(prompt);
      await sock.sendMessage(chatId, { text: respostaIA });
      break;

    case "!imagine":
    case "/imagine":
      const descricao = texto.replace(/^(\/|!)imagine\s*/i, "").trim();
      if (!descricao) {
        await sock.sendMessage(chatId, { text: "Descreva a imagem. Ex: !imagine um gato astronauta" });
        return;
      }
      const urlImagem = await gerarImagemIA(descricao);
      if (urlImagem.startsWith("http")) {
        await sock.sendMessage(chatId, { image: { url: urlImagem }, caption: "✨ Imagem gerada por IA" });
      } else {
        await sock.sendMessage(chatId, { text: urlImagem });
      }
      break;

    case "!traduzir":
    case "/traduzir":
      const textoParaTraduzir = texto.replace(/^(\/|!)traduzir\s*/i, "").trim();
      if (!textoParaTraduzir) {
        await sock.sendMessage(chatId, { text: "Digite o texto para traduzir." });
        return;
      }
      const traducao = await traduzirTexto(textoParaTraduzir);
      await sock.sendMessage(chatId, { text: traducao });
      break;

    case "!resumir":
    case "/resumir":
      const textoParaResumir = texto.replace(/^(\/|!)resumir\s*/i, "").trim();
      if (!textoParaResumir) {
        await sock.sendMessage(chatId, { text: "Digite o texto para resumir." });
        return;
      }
      const resumo = await resumirTexto(textoParaResumir);
      await sock.sendMessage(chatId, { text: resumo });
      break;

    default:
      // Verifica se há partida de jogo ativa (resposta de anagrama, ppt, etc.)
      const respondeuJogo = await processarRespostaJogo(sock, chatId, remetente, texto);
      if (!respondeuJogo) {
        // Não é comando de diversão; ignora
      }
      break;
  }
}

module.exports = { handleDiversao };
