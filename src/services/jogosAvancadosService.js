// ==============================================
// LARI MYSTIC BOT - SERVIÇO DE JOGOS AVANÇADOS
// ==============================================

const logger = require("../utils/logger");

// Palavras para jogos
const palavrasForca = ["telegram", "whatsapp", "computador", "internet", "javascript", "baileys", "mistico", "aventura"];

/**
 * Inicia um jogo da forca.
 */
function iniciarForca(chatId, remetente) {
  const palavra = palavrasForca[Math.floor(Math.random() * palavrasForca.length)];
  global.jogosForca = global.jogosForca || new Map();
  global.jogosForca.set(chatId, {
    palavra,
    letrasTentadas: [],
    erros: 0,
    maxErros: 6,
    remetente,
  });
  return palavra.length;
}

/**
 * Processa tentativa de letra na forca.
 */
function tentarLetraForca(chatId, letra) {
  const jogo = global.jogosForca?.get(chatId);
  if (!jogo) return null;

  letra = letra.toLowerCase();
  if (jogo.letrasTentadas.includes(letra)) return "repetida";

  jogo.letrasTentadas.push(letra);
  if (jogo.palavra.includes(letra)) {
    const letras = jogo.palavra.split("").map(l => (jogo.letrasTentadas.includes(l) ? l : "_"));
    const palavraOculta = letras.join(" ");
    if (!palavraOculta.includes("_")) {
      global.jogosForca.delete(chatId);
      return { resultado: "venceu", palavra: jogo.palavra };
    }
    return { resultado: "acertou", palavraOculta };
  } else {
    jogo.erros++;
    if (jogo.erros >= jogo.maxErros) {
      global.jogosForca.delete(chatId);
      return { resultado: "perdeu", palavra: jogo.palavra };
    }
    return { resultado: "errou", erros: jogo.erros, maxErros: jogo.maxErros };
  }
}

/**
 * Quiz simples.
 */
const quizPerguntas = [
  { pergunta: "Qual é a capital do Brasil?", resposta: "brasilia" },
  { pergunta: "Quanto é 2 + 2?", resposta: "4" },
  { pergunta: "Qual a cor do céu?", resposta: "azul" },
];

/**
 * Inicia quiz.
 */
function iniciarQuiz(chatId) {
  global.quizAtual = global.quizAtual || new Map();
  const pergunta = quizPerguntas[Math.floor(Math.random() * quizPerguntas.length)];
  global.quizAtual.set(chatId, pergunta);
  return pergunta.pergunta;
}

/**
 * Verifica resposta do quiz.
 */
function responderQuiz(chatId, resposta) {
  const pergunta = global.quizAtual?.get(chatId);
  if (!pergunta) return null;
  if (resposta.trim().toLowerCase() === pergunta.resposta) {
    global.quizAtual.delete(chatId);
    return true;
  }
  return false;
}

module.exports = {
  iniciarForca,
  tentarLetraForca,
  iniciarQuiz,
  responderQuiz,
};
