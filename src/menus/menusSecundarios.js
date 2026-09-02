// ==============================================
// LARI MYSTIC BOT - CARTAS MÍSTICAS COM CARROSSEL
// ==============================================

const logger = require("../utils/logger");
const { NIVEIS, obterNivelUsuario, validarToken } = require("./permissoes");
const { extrairNumero } = require("../utils/helpers");

global.estadoCartas = new Map();

async function processarCarta(sock, chatId, remetente, isGroup) {
  const nivel = await obterNivelUsuario(sock, chatId, remetente);
  const numero = extrairNumero(remetente);

  global.estadoCartas.set(numero, {
    chatId,
    remetente,
    nivel,
    carta: "principal",
  });

  const cards = [
    {
      titulo: "🃏 PORTAL MÍSTICO",
      descricao: "Você encontrou uma porta antiga.\nEscolha seu destino:",
      botao: { id: "diversao", texto: "🎭 Explorar Diversão" },
    },
    {
      titulo: "⚔️ DESAFIOS",
      descricao: "Aventure-se em batalhas e RPG.",
      botao: { id: "desafios", texto: "⚔️ Buscar Desafios" },
    },
  ];

  if (nivel >= NIVEIS.ADMIN) {
    cards.push({
      titulo: "🛡️ PROTEÇÕES",
      descricao: "Gerencie a segurança do grupo.",
      botao: { id: "protecoes", texto: "🛡️ Ativar Proteções" },
    });
  }

  if (nivel >= NIVEIS.DONO) {
    cards.push({
      titulo: "👑 SALÃO DO DONO",
      descricao: "Acesso total ao reino.",
      botao: { id: "dono", texto: "👑 Falar com o Dono" },
    });
  }

  cards.push({
    titulo: "🔑 CHAVE SECRETA",
    descricao: "Insira o token para abrir.",
    botao: { id: "chave", texto: "🔑 Abrir com Chave" },
  });

  await enviarCarrossel(sock, chatId, cards);
}

async function enviarCarrossel(sock, chatId, cards) {
  for (const card of cards) {
    await sock.sendMessage(chatId, {
      text: `*${card.titulo}*\n\n${card.descricao}`,
      footer: "Toque no botão abaixo",
      buttons: [
        {
          buttonId: card.botao.id,
          buttonText: { displayText: card.botao.texto },
          type: 1,
        }
      ],
      headerType: 1,
    });
    // Pequena pausa para parecer carrossel
    await new Promise(resolve => setTimeout(resolve, 300));
  }
}

async function processarRespostaCarta(sock, chatId, remetente, texto) {
  const numero = extrairNumero(remetente);
  const estado = global.estadoCartas.get(numero);
  if (!estado) return;

  const resposta = texto.trim().toLowerCase();

  if (estado.carta === "principal") {
    if (resposta === "diversao") {
      await cartaDiversao(sock, chatId, remetente);
    } else if (resposta === "desafios") {
      await cartaDesafios(sock, chatId, remetente);
    } else if (resposta === "protecoes") {
      await cartaProtecoes(sock, chatId, remetente);
    } else if (resposta === "dono") {
      await cartaDono(sock, chatId, remetente);
    } else if (resposta === "chave") {
      await cartaChave(sock, chatId, remetente);
    } else if (resposta === "voltar") {
      await processarCarta(sock, chatId, remetente, false);
    }
  } else if (estado.carta === "chave") {
    const tokenValido = validarToken(texto);
    if (tokenValido) {
      await sock.sendMessage(chatId, { text: "🔓 Acesso concedido!" });
      global.estadoCartas.delete(numero);
    } else {
      await sock.sendMessage(chatId, { text: "⛔ Token incorreto. Acesso negado." });
      global.estadoCartas.delete(numero);
    }
  }
}

async function cartaDiversao(sock, chatId, remetente) {
  const numero = extrairNumero(remetente);
  global.estadoCartas.set(numero, {
    chatId,
    remetente,
    carta: "diversao",
  });

  const cards = [
    { titulo: "🎮 JOGOS", descricao: "Dados, forca, quiz e mais.", botao: { id: "jogos", texto: "🎮 Jogos" } },
    { titulo: "🤖 IA", descricao: "Converse com a inteligência artificial.", botao: { id: "ia", texto: "🤖 IA" } },
    { titulo: "🎨 STICKERS", descricao: "Crie figurinhas personalizadas.", botao: { id: "stickers", texto: "🎨 Stickers" } },
    { titulo: "⏮️ VOLTAR", descricao: "Retorne ao portal.", botao: { id: "voltar", texto: "⏮️ Voltar" } },
  ];

  await enviarCarrossel(sock, chatId, cards);
}

async function cartaDesafios(sock, chatId, remetente) {
  const numero = extrairNumero(remetente);
  global.estadoCartas.set(numero, {
    chatId,
    remetente,
    carta: "desafios",
  });

  const cards = [
    { titulo: "⚔️ RPG", descricao: "Crie personagem e evolua.", botao: { id: "rpg", texto: "⚔️ RPG" } },
    { titulo: "⚔️ BATALHA", descricao: "Duelo entre jogadores.", botao: { id: "batalha", texto: "⚔️ Batalha" } },
    { titulo: "⏮️ VOLTAR", descricao: "Retorne ao portal.", botao: { id: "voltar", texto: "⏮️ Voltar" } },
  ];

  await enviarCarrossel(sock, chatId, cards);
}

async function cartaProtecoes(sock, chatId, remetente) {
  const numero = extrairNumero(remetente);
  global.estadoCartas.set(numero, {
    chatId,
    remetente,
    carta: "protecoes",
  });

  const cards = [
    { titulo: "🛡️ ANTI-LINK", descricao: "Bloqueie links indesejados.", botao: { id: "anti_link", texto: "🛡️ Anti-Link" } },
    { titulo: "🛡️ ANTI-FLOOD", descricao: "Punir spam de mensagens.", botao: { id: "anti_flood", texto: "🛡️ Anti-Flood" } },
    { titulo: "🛡️ LISTA NEGRA", descricao: "Gerencie banidos.", botao: { id: "lista_negra", texto: "🛡️ Lista Negra" } },
    { titulo: "🏰 MODO FORTALEZA", descricao: "Trave o grupo.", botao: { id: "modo_fortaleza", texto: "🏰 Modo Fortaleza" } },
    { titulo: "⏮️ VOLTAR", descricao: "Retorne ao portal.", botao: { id: "voltar", texto: "⏮️ Voltar" } },
  ];

  await enviarCarrossel(sock, chatId, cards);
}

async function cartaDono(sock, chatId, remetente) {
  const nivel = await obterNivelUsuario(sock, chatId, remetente);
  if (nivel < NIVEIS.DONO) {
    await sock.sendMessage(chatId, { text: "⛔ Apenas o Dono pode abrir esta porta." });
    return;
  }

  const numero = extrairNumero(remetente);
  global.estadoCartas.set(numero, {
    chatId,
    remetente,
    carta: "dono",
  });

  const cards = [
    { titulo: "📢 BROADCAST", descricao: "Envie mensagem para todos.", botao: { id: "broadcast", texto: "📢 Broadcast" } },
    { titulo: "🔥 ZERAR TUDO", descricao: "Resetar dados.", botao: { id: "zerar", texto: "🔥 Zerar Tudo" } },
    { titulo: "🔑 GERAR TOKEN", descricao: "Novo token de segurança.", botao: { id: "token", texto: "🔑 Gerar Token" } },
    { titulo: "📋 VER LOGS", descricao: "Últimos registros.", botao: { id: "logs", texto: "📋 Ver Logs" } },
    { titulo: "⏮️ VOLTAR", descricao: "Retorne ao portal.", botao: { id: "voltar", texto: "⏮️ Voltar" } },
  ];

  await enviarCarrossel(sock, chatId, cards);
}

async function cartaChave(sock, chatId, remetente) {
  const numero = extrairNumero(remetente);
  global.estadoCartas.set(numero, {
    chatId,
    remetente,
    carta: "chave",
  });

  await sock.sendMessage(chatId, { text: "🔑 Digite o token secreto para abrir:" });
}

module.exports = {
  processarCarta,
  processarRespostaCarta,
};
