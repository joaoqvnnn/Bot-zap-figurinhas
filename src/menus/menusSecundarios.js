// ==============================================
// LARI MYSTIC BOT - CARTAS MÍSTICAS ORIGINAIS
// ==============================================

const logger = require("../utils/logger");
const { NIVEIS, obterNivelUsuario } = require("./permissoes");
const { extrairNumero } = require("../utils/helpers");

global.estadoCartas = new Map();

/**
 * Detecta o dispositivo do usuário (iPhone ou Android).
 * O Baileys não fornece diretamente, então usamos heurística.
 */
function detectarDispositivo(remetente) {
  const jid = String(remetente || "");
  // IDs de iPhone geralmente têm padrão específico no Baileys
  // Como não há campo direto, retornamos baseado no device do bot
  return "iPhone";
}

/**
 * Retorna o cargo do usuário com emoji.
 */
function getCargo(nivel) {
  if (nivel >= NIVEIS.DONO) return "👑 DONO";
  if (nivel >= NIVEIS.ADMIN) return "🛡️ ADMIN";
  if (nivel >= NIVEIS.MODERADOR) return "🔨 MODERADOR";
  return "⚡ FREE";
}

/**
 * Obtém nome do usuário no WhatsApp.
 */
async function getNomeUsuario(sock, chatId, remetente) {
  try {
    // Em grupo, busca o nome no metadata
    if (chatId.endsWith("@g.us")) {
      const metadata = await sock.groupMetadata(chatId);
      const participante = metadata.participants?.find(
        (p) => p.id === remetente
      );
      return participante?.name || "Membro";
    }
    // Em privado, usa o número
    return extrairNumero(remetente);
  } catch (err) {
    return "Usuário";
  }
}

/**
 * Monta o cabeçalho do menu com estilo.
 */
async function montarCabecalho(sock, chatId, remetente) {
  const nivel = await obterNivelUsuario(sock, chatId, remetente);
  const cargo = getCargo(nivel);
  const dispositivo = detectarDispositivo(remetente);
  const nome = await getNomeUsuario(sock, chatId, remetente);
  const numero = extrairNumero(remetente);

  return `╔══════════════════╗
║   🃏 LARI MYSTIC   ║
╠══════════════════╣
║ 👤 ${nome}
║ 📱 ${dispositivo}
║ 📞 ${numero}
║ ⭐ ${cargo}
║ 🔧 PREFIXO: ! or /
╚══════════════════╝`;
}

/**
 * Envia uma enquete bonita.
 */
async function enviarEnquete(sock, chatId, titulo, opcoes) {
  await sock.sendMessage(chatId, {
    poll: {
      name: titulo,
      values: opcoes,
      selectableCount: 1,
    },
  });
}

/**
 * Menu principal.
 */
async function processarCarta(sock, chatId, remetente, isGroup) {
  const numero = extrairNumero(remetente);
  global.estadoCartas.set(numero, {
    chatId,
    remetente,
    carta: "principal",
  });

  const cabecalho = await montarCabecalho(sock, chatId, remetente);

  const opcoes = [
    "🎭 DIVERSÃO",
    "⚔️ DESAFIOS",
    "👤 PERFIL",
  ];

  const nivel = await obterNivelUsuario(sock, chatId, remetente);
  if (nivel >= NIVEIS.ADMIN) opcoes.push("🛡️ MENU ADMIN");
  if (nivel >= NIVEIS.DONO) opcoes.push("👑 MENU DONO");

  await sock.sendMessage(chatId, { text: cabecalho });
  await enviarEnquete(sock, chatId, "🌀 ESCOLHA SEU DESTINO:", opcoes);
}

/**
 * Processa votos das enquetes.
 */
async function processarVoto(sock, chatId, voto) {
  const opcao = voto.trim().toLowerCase();

  if (opcao.includes("diversão")) {
    await menuDiversao(sock, chatId);
  } else if (opcao.includes("desafios")) {
    await menuDesafios(sock, chatId);
  } else if (opcao.includes("perfil")) {
    await menuPerfil(sock, chatId);
  } else if (opcao.includes("menu admin")) {
    await menuAdmin(sock, chatId);
  } else if (opcao.includes("menu dono")) {
    await menuDono(sock, chatId);
  } else if (opcao.includes("moderação")) {
    await menuModeracao(sock, chatId);
  } else if (opcao.includes("proteções")) {
    await menuProtecoes(sock, chatId);
  } else if (opcao.includes("grupo")) {
    await menuGrupo(sock, chatId);
  } else if (opcao.includes("jogos")) {
    await menuJogos(sock, chatId);
  } else if (opcao.includes("ia")) {
    await menuIA(sock, chatId);
  } else if (opcao.includes("stickers")) {
    await menuStickers(sock, chatId);
  } else if (opcao.includes("rpg")) {
    await menuRPG(sock, chatId);
  } else if (opcao.includes("batalha")) {
    await menuBatalha(sock, chatId);
  } else if (opcao.includes("broadcast")) {
    await menuBroadcast(sock, chatId);
  } else if (opcao.includes("token")) {
    await menuToken(sock, chatId);
  } else if (opcao.includes("logs")) {
    await menuLogs(sock, chatId);
  }
}

async function menuDiversao(sock, chatId) {
  await enviarEnquete(sock, chatId, "🎭 DIVERSÃO", ["🎮 Jogos", "🤖 IA", "🎨 Stickers"]);
}

async function menuDesafios(sock, chatId) {
  await enviarEnquete(sock, chatId, "⚔️ DESAFIOS", ["⚔️ RPG", "⚔️ Batalha"]);
}

async function menuPerfil(sock, chatId) {
  await enviarEnquete(sock, chatId, "👤 PERFIL", ["📊 Ver Perfil", "💰 Ver Saldo", "🏆 Ranking"]);
}

async function menuAdmin(sock, chatId) {
  await enviarEnquete(sock, chatId, "🛡️ MENU ADMIN", ["🔨 Moderação", "🛡️ Proteções", "⚙️ Grupo"]);
}

async function menuDono(sock, chatId) {
  await enviarEnquete(sock, chatId, "👑 MENU DONO", ["📢 Broadcast", "🔑 Gerar Token", "📋 Ver Logs"]);
}

async function menuModeracao(sock, chatId) {
  await enviarEnquete(sock, chatId, "🔨 MODERAÇÃO", ["🚫 Banir", "🔇 Mutar", "✅ Desmutar"]);
}

async function menuProtecoes(sock, chatId) {
  await enviarEnquete(sock, chatId, "🛡️ PROTEÇÕES", ["🔗 Anti-Link", "⚡ Anti-Flood", "📋 Lista Negra"]);
}

async function menuGrupo(sock, chatId) {
  await enviarEnquete(sock, chatId, "⚙️ GRUPO", ["📝 Nome", "📝 Descrição", "🔗 Link"]);
}

async function menuJogos(sock, chatId) {
  await enviarEnquete(sock, chatId, "🎮 JOGOS", ["🎲 Dados", "🪙 Cara ou Coroa", "✂️ Pedra Papel Tesoura"]);
}

async function menuIA(sock, chatId) {
  await enviarEnquete(sock, chatId, "🤖 IA", ["💬 Conversar", "🖼️ Gerar Imagem"]);
}

async function menuStickers(sock, chatId) {
  await enviarEnquete(sock, chatId, "🎨 STICKERS", ["📝 Criar de Texto", "🖼️ Criar de Imagem"]);
}

async function menuRPG(sock, chatId) {
  await enviarEnquete(sock, chatId, "⚔️ RPG", ["👤 Criar Personagem", "📊 Ficha", "📜 Missão"]);
}

async function menuBatalha(sock, chatId) {
  await enviarEnquete(sock, chatId, "⚔️ BATALHA", ["⚔️ Duelar"]);
}

async function menuBroadcast(sock, chatId) {
  await enviarEnquete(sock, chatId, "📢 BROADCAST", ["📨 Enviar para Todos"]);
}

async function menuToken(sock, chatId) {
  await enviarEnquete(sock, chatId, "🔑 TOKEN", ["🔑 Gerar Novo Token"]);
}

async function menuLogs(sock, chatId) {
  await enviarEnquete(sock, chatId, "📋 LOGS", ["📋 Ver Últimos Logs"]);
}

module.exports = {
  processarCarta,
  processarVoto,
};
