// ==============================================
// LARI MYSTIC BOT - SISTEMA DE CARTAS MÍSTICAS
// ==============================================

const logger = require("../utils/logger");
const { NIVEIS, obterNivelUsuario, validarToken } = require("./permissoes");
const { extrairNumero } = require("../utils/helpers");

global.estadoCartas = new Map();

async function processarCarta(sock, chatId, remetente, isGroup) {
  const nivel = await obterNivelUsuario(sock, chatId, remetente);
  const numero = extrairNumero(remetente);

  const opcoes = [];
  opcoes.push({ id: "diversao", texto: "🎭 Explorar Diversão" });
  opcoes.push({ id: "desafios", texto: "⚔️ Buscar Desafios" });
  if (nivel >= NIVEIS.ADMIN) {
    opcoes.push({ id: "protecoes", texto: "🛡️ Ativar Proteções" });
  }
  if (nivel >= NIVEIS.DONO) {
    opcoes.push({ id: "dono", texto: "👑 Falar com o Dono" });
  }
  opcoes.push({ id: "chave", texto: "🔑 Abrir com Chave" });

  global.estadoCartas.set(numero, {
    chatId,
    remetente,
    nivel,
    carta: "principal",
  });

  const texto = "Você encontrou uma porta antiga. O que deseja fazer?";

  await enviarCartaInterativa(sock, chatId, texto, opcoes);
}

async function processarRespostaCarta(sock, chatId, remetente, texto) {
  const numero = extrairNumero(remetente);
  const estado = global.estadoCartas.get(numero);
  if (!estado) return;

  const resposta = texto.trim().toLowerCase();

  if (estado.carta === "principal") {
    if (resposta === "diversao" || resposta === "1") {
      await cartaDiversao(sock, chatId, remetente);
    } else if (resposta === "desafios" || resposta === "2") {
      await cartaDesafios(sock, chatId, remetente);
    } else if (resposta === "protecoes" || resposta === "3") {
      await cartaProtecoes(sock, chatId, remetente);
    } else if (resposta === "dono" || resposta === "4") {
      await cartaDono(sock, chatId, remetente);
    } else if (resposta === "chave" || resposta === "5") {
      await cartaChave(sock, chatId, remetente);
    } else {
      await sock.sendMessage(chatId, { text: "Opção inválida. Envie 'menu' para reiniciar." });
    }
  } else if (estado.carta === "chave") {
    const tokenValido = validarToken(texto);
    if (tokenValido) {
      await sock.sendMessage(chatId, { text: "🔓 Acesso concedido!" });
      global.estadoCartas.delete(numero);
      await cartaAdmin(sock, chatId, remetente);
    } else {
      await sock.sendMessage(chatId, { text: "⛔ Token incorreto. Acesso negado." });
      global.estadoCartas.delete(numero);
    }
  }
}

async function enviarCartaInterativa(sock, chatId, texto, opcoes) {
  try {
    const buttons = opcoes.map((op, i) => ({
      buttonId: op.id,
      buttonText: { displayText: op.texto },
      type: 1,
    }));
    await sock.sendMessage(chatId, {
      text,
      buttons,
      headerType: 1,
    });
  } catch (err) {
    let msg = texto + "\n\n";
    opcoes.forEach((op, i) => {
      msg += `${i + 1}. ${op.texto}\n`;
    });
    msg += "\nResponda com o número da opção.";
    await sock.sendMessage(chatId, { text: msg });
  }
}

async function cartaDiversao(sock, chatId, remetente) {
  const numero = extrairNumero(remetente);
  global.estadoCartas.set(numero, {
    chatId,
    remetente,
    carta: "diversao",
  });
  const opcoes = [
    { id: "jogos", texto: "🎮 Jogos" },
    { id: "ia", texto: "🤖 Inteligência Artificial" },
    { id: "stickers", texto: "🎨 Stickers e Mídia" },
  ];
  await enviarCartaInterativa(sock, chatId, "🎭 Área de Diversão\nEscolha uma trilha:", opcoes);
}

async function cartaDesafios(sock, chatId, remetente) {
  const numero = extrairNumero(remetente);
  global.estadoCartas.set(numero, {
    chatId,
    remetente,
    carta: "desafios",
  });
  const opcoes = [
    { id: "rpg", texto: "⚔️ Sistema de RPG" },
    { id: "batalha", texto: "⚔️ Batalha" },
  ];
  await enviarCartaInterativa(sock, chatId, "⚔️ Desafios\nPrepare-se:", opcoes);
}

async function cartaProtecoes(sock, chatId, remetente) {
  const numero = extrairNumero(remetente);
  global.estadoCartas.set(numero, {
    chatId,
    remetente,
    carta: "protecoes",
  });
  const opcoes = [
    { id: "anti_link", texto: "🛡️ Anti-Link" },
    { id: "anti_flood", texto: "🛡️ Anti-Flood" },
    { id: "lista_negra", texto: "🛡️ Lista Negra" },
    { id: "modo_fortaleza", texto: "🏰 Modo Fortaleza" },
  ];
  await enviarCartaInterativa(sock, chatId, "🛡️ Central de Proteções:", opcoes);
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
  const opcoes = [
    { id: "broadcast", texto: "📢 Broadcast" },
    { id: "zerar", texto: "🔥 Zerar Tudo" },
    { id: "token", texto: "🔑 Gerar Token" },
    { id: "logs", texto: "📋 Ver Logs" },
  ];
  await enviarCartaInterativa(sock, chatId, "👑 Salão do Dono:", opcoes);
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

async function cartaAdmin(sock, chatId, remetente) {
  await sock.sendMessage(chatId, { text: "👑 Menu administrativo em construção..." });
}

module.exports = {
  processarCarta,
  processarRespostaCarta,
};
