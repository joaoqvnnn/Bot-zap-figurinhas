// ==============================================
// LARI MYSTIC BOT - SERVIÇO DE RPG
// ==============================================

const logger = require("../utils/logger");
const { gerarIdUnico } = require("../utils/helpers");

// Banco de dados temporário de personagens (será migrado para MongoDB)
global.personagensRPG = new Map();

/**
 * Cria um novo personagem para o usuário.
 * @param {string} remetente - ID do usuário
 * @param {string} nome - Nome do personagem
 */
async function criarPersonagem(sock, chatId, remetente, nome) {
  if (global.personagensRPG.has(remetente)) {
    await sock.sendMessage(chatId, { text: "⚔️ Você já possui um personagem!" });
    return;
  }

  const personagem = {
    id: remetente,
    nome: nome || "Aventureiro",
    nivel: 1,
    xp: 0,
    hp: 100,
    hpMax: 100,
    ataque: 10,
    defesa: 5,
    ouro: 0,
    criadoEm: new Date().toISOString(),
  };

  global.personagensRPG.set(remetente, personagem);
  await sock.sendMessage(chatId, {
    text: `⚔️ Personagem criado com sucesso!\n\n` +
          `👤 Nome: ${personagem.nome}\n` +
          `❤️ HP: ${personagem.hp}/${personagem.hpMax}\n` +
          `⚔️ Ataque: ${personagem.ataque}\n` +
          `🛡️ Defesa: ${personagem.defesa}\n` +
          `📊 Nível: ${personagem.nivel}`
  });
}

/**
 * Exibe a ficha do personagem.
 */
async function fichaPersonagem(sock, chatId, remetente) {
  const personagem = global.personagensRPG.get(remetente);
  if (!personagem) {
    await sock.sendMessage(chatId, { text: "❌ Você ainda não criou seu personagem." });
    return;
  }

  await sock.sendMessage(chatId, {
    text: `📋 FICHA DO PERSONAGEM\n\n` +
          `👤 Nome: ${personagem.nome}\n` +
          `📊 Nível: ${personagem.nivel}\n` +
          `✨ XP: ${personagem.xp}\n` +
          `❤️ HP: ${personagem.hp}/${personagem.hpMax}\n` +
          `⚔️ Ataque: ${personagem.ataque}\n` +
          `🛡️ Defesa: ${personagem.defesa}\n` +
          `💰 Ouro: ${personagem.ouro}`
  });
}

/**
 * Adiciona XP ao personagem e verifica evolução.
 */
async function adicionarXP(sock, chatId, remetente, quantidade) {
  const personagem = global.personagensRPG.get(remetente);
  if (!personagem) {
    await sock.sendMessage(chatId, { text: "❌ Personagem não encontrado." });
    return;
  }

  personagem.xp += quantidade;
  let evoluiu = false;

  while (personagem.xp >= personagem.nivel * 100) {
    personagem.xp -= personagem.nivel * 100;
    personagem.nivel++;
    personagem.hpMax += 20;
    personagem.hp = personagem.hpMax;
    personagem.ataque += 5;
    personagem.defesa += 3;
    evoluiu = true;
  }

  await sock.sendMessage(chatId, {
    text: `✨ Você ganhou ${quantidade} XP!` + (evoluiu ? `\n🎉 Subiu para o nível ${personagem.nivel}!` : "")
  });
}

/**
 * Realiza uma missão diária simples.
 */
async function missaoDiaria(sock, chatId, remetente) {
  const personagem = global.personagensRPG.get(remetente);
  if (!personagem) {
    await sock.sendMessage(chatId, { text: "❌ Crie seu personagem primeiro." });
    return;
  }

  const xpGanho = Math.floor(Math.random() * 50) + 20;
  const ouroGanho = Math.floor(Math.random() * 20) + 5;

  personagem.xp += xpGanho;
  personagem.ouro += ouroGanho;

  await sock.sendMessage(chatId, {
    text: `📜 Missão concluída!\n\n` +
          `✨ XP ganho: ${xpGanho}\n` +
          `💰 Ouro ganho: ${ouroGanho}`
  });
}

/**
 * Realiza uma batalha simples entre dois jogadores.
 */
async function batalha(sock, chatId, desafianteId, desafiadoId) {
  const desafiante = global.personagensRPG.get(desafianteId);
  const desafiado = global.personagensRPG.get(desafiadoId);

  if (!desafiante || !desafiado) {
    await sock.sendMessage(chatId, { text: "❌ Um dos jogadores não possui personagem." });
    return;
  }

  // Batalha simplificada
  const danoDesafiante = Math.max(1, desafiante.ataque - desafiado.defesa);
  const danoDesafiado = Math.max(1, desafiado.ataque - desafiante.defesa);

  desafiante.hp -= danoDesafiado;
  desafiado.hp -= danoDesafiante;

  let resultado = "";
  if (desafiante.hp <= 0 && desafiado.hp <= 0) {
    resultado = "🤝 Empate! Os dois lutadores caíram!";
    desafiante.hp = Math.max(0, desafiante.hp);
    desafiado.hp = Math.max(0, desafiado.hp);
  } else if (desafiante.hp <= 0) {
    resultado = `🏆 ${desafiado.nome} venceu a batalha!`;
    desafiante.hp = 0;
    desafiado.ouro += 10;
  } else if (desafiado.hp <= 0) {
    resultado = `🏆 ${desafiante.nome} venceu a batalha!`;
    desafiado.hp = 0;
    desafiante.ouro += 10;
  } else {
    resultado = `⚔️ Ambos sobreviveram!\n${desafiante.nome}: ${desafiante.hp} HP\n${desafiado.nome}: ${desafiado.hp} HP`;
  }

  await sock.sendMessage(chatId, { text: resultado });
}

module.exports = {
  criarPersonagem,
  fichaPersonagem,
  adicionarXP,
  missaoDiaria,
  batalha,
};
