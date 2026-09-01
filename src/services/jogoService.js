// ==============================================
// LARI MYSTIC BOT - SERVIÇO DE JOGOS
// ==============================================

const logger = require("../utils/logger");
const { gerarIdUnico } = require("../utils/helpers");

// Armazena partidas em andamento (em produção usar MongoDB)
global.partidas = new Map();

/**
 * Inicia um jogo de dados.
 * @param {object} sock
 * @param {string} chatId
 * @param {string} remetente
 */
async function jogoDados(sock, chatId, remetente) {
  const numero = Math.floor(Math.random() * 6) + 1;
  await sock.sendMessage(chatId, {
    text: `🎲 O dado rolou...\n\nResultado: ${numero}`,
  });
}

/**
 * Joga cara ou coroa.
 */
async function jogoCaraOuCoroa(sock, chatId, remetente) {
  const resultado = Math.random() < 0.5 ? "😄 Cara" : "👑 Coroa";
  await sock.sendMessage(chatId, {
    text: `🪙 Girei a moeda...\n\nResultado: ${resultado}`,
  });
}

/**
 * Jogo de pedra, papel e tesoura.
 * O usuário envia sua escolha como texto ou por número.
 */
async function jogoPedraPapelTesoura(sock, chatId, remetente, escolhaUsuario) {
  const opcoes = ["pedra", "papel", "tesoura"];
  const escolhaBot = opcoes[Math.floor(Math.random() * 3)];
  const escolha = String(escolhaUsuario).toLowerCase().trim();

  if (!opcoes.includes(escolha)) {
    await sock.sendMessage(chatId, {
      text: "Escolha entre pedra, papel ou tesoura.",
    });
    return;
  }

  let resultado = "";
  if (escolha === escolhaBot) {
    resultado = "🤝 Empate!";
  } else if (
    (escolha === "pedra" && escolhaBot === "tesoura") ||
    (escolha === "papel" && escolhaBot === "pedra") ||
    (escolha === "tesoura" && escolhaBot === "papel")
  ) {
    resultado = "🎉 Você venceu!";
  } else {
    resultado = "😞 Eu venci!";
  }

  await sock.sendMessage(chatId, {
    text: `🗿 Você: ${escolha}\n🤖 Bot: ${escolhaBot}\n\n${resultado}`,
  });
}

/**
 * Gera um desafio de anagrama e aguarda resposta.
 */
async function jogoAnagrama(sock, chatId, remetente, palavra = "telegram") {
  const letras = palavra.split("");
  // Embaralha as letras
  for (let i = letras.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letras[i], letras[j]] = [letras[j], letras[i]];
  }
  const anagrama = letras.join("");

  global.partidas.set(remetente, {
    tipo: "anagrama",
    resposta: palavra,
    chatId,
    timestamp: Date.now(),
  });

  await sock.sendMessage(chatId, {
    text: `🧩 Anagrama: ${anagrama}\n\nResponda com a palavra correta!`,
  });
}

/**
 * Processa resposta de jogos ativos.
 */
async function processarRespostaJogo(sock, chatId, remetente, texto) {
  const partida = global.partidas.get(remetente);
  if (!partida || partida.chatId !== chatId) return false;

  const resposta = texto.trim().toLowerCase();

  if (partida.tipo === "anagrama") {
    if (resposta === partida.resposta.toLowerCase()) {
      await sock.sendMessage(chatId, { text: "🎉 Parabéns! Resposta correta!" });
      global.partidas.delete(remetente);
      return true;
    } else {
      await sock.sendMessage(chatId, { text: "❌ Resposta incorreta. Tente novamente!" });
      return true;
    }
  }

  return false;
}

module.exports = {
  jogoDados,
  jogoCaraOuCoroa,
  jogoPedraPapelTesoura,
  jogoAnagrama,
  processarRespostaJogo,
};
