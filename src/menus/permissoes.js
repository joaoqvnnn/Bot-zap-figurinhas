// ==============================================
// LARI MYSTIC BOT - CONTROLE DE PERMISSÕES E NÍVEIS
// ==============================================

const config = require("../config");
const logger = require("../utils/logger");
const { extrairNumero } = require("../utils/helpers");

// Possíveis níveis de usuário
const NIVEIS = {
  DONO: 100,
  ADMIN: 80,
  MODERADOR: 50,
  MEMBRO: 10,
  BLOQUEADO: 0,
};

// Mapa de comandos e permissões mínimas
// Em breve isso será movido para o banco de dados.
const PERMISSOES_COMANDOS = {
  // Comandos acessíveis a todos os membros
  menu: NIVEIS.MEMBRO,
  carta: NIVEIS.MEMBRO,
  ajuda: NIVEIS.MEMBRO,
  sobre: NIVEIS.MEMBRO,
  perfil: NIVEIS.MEMBRO,
  // Diversão e jogos
  dados: NIVEIS.MEMBRO,
  "pedra-papel-tesoura": NIVEIS.MEMBRO,
  "cara-ou-coroa": NIVEIS.MEMBRO,
  // Comandos de moderador
  ban: NIVEIS.MODERADOR,
  mute: NIVEIS.MODERADOR,
  desmute: NIVEIS.MODERADOR,
  adv: NIVEIS.MODERADOR,
  rmadv: NIVEIS.MODERADOR,
  listmods: NIVEIS.MODERADOR,
  // Comandos de admin
  promover: NIVEIS.ADMIN,
  rebaixar: NIVEIS.ADMIN,
  addmod: NIVEIS.ADMIN,
  delmod: NIVEIS.ADMIN,
  ativar: NIVEIS.ADMIN,
  desativar: NIVEIS.ADMIN,
  status: NIVEIS.ADMIN,
  setname: NIVEIS.ADMIN,
  setdesc: NIVEIS.ADMIN,
  linkgp: NIVEIS.ADMIN,
  // Comandos do dono
  token: NIVEIS.DONO,
  "modo-manutencao": NIVEIS.DONO,
  "zerar-tudo": NIVEIS.DONO,
  broadcast: NIVEIS.DONO,
  "ver-logs": NIVEIS.DONO,
};

/**
 * Obtém o nível de permissão de um usuário em um determinado chat.
 * @param {object} sock - Socket do Baileys
 * @param {string} chatId - ID do chat (grupo ou privado)
 * @param {string} remetente - ID do remetente
 * @returns {number} Nível do usuário
 */
async function obterNivelUsuario(sock, chatId, remetente) {
  const numeroDono = limparNumero(config.DONO);
  const numeroRemetente = limparNumero(extrairNumero(remetente));

  // Dono tem acesso total em qualquer lugar
  if (numeroDono && numeroRemetente === numeroDono) {
    return NIVEIS.DONO;
  }

  // Se for conversa privada, membro tem permissão de membro
  if (!chatId.endsWith("@g.us")) {
    return NIVEIS.MEMBRO;
  }

  // Verificar se é admin ou moderador no grupo
  try {
    const grupoMetadata = await sock.groupMetadata(chatId);
    const participantes = grupoMetadata.participants || [];

    const participante = participantes.find(
      (p) => limparNumero(p.id) === numeroRemetente
    );

    if (!participante) return NIVEIS.MEMBRO;

    if (participante.admin === "superadmin") {
      return NIVEIS.ADMIN;
    }
    if (participante.admin === "admin") {
      return NIVEIS.ADMIN;
    }
  } catch (err) {
    logger.warn(`Não foi possível verificar admin do grupo ${chatId}: ${err.message}`);
  }

  // Aqui podemos verificar no banco se é moderador
  // Por enquanto retornamos membro
  return NIVEIS.MEMBRO;
}

/**
 * Verifica se um usuário pode executar um comando.
 * @param {object} sock - Socket do Baileys
 * @param {string} chatId - ID do chat
 * @param {string} remetente - ID do remetente
 * @param {string} comando - Nome do comando (sem / ou !)
 * @param {boolean} isGroup - Se é mensagem de grupo
 * @returns {boolean} Se tem permissão
 */
async function verificarPermissao(sock, chatId, remetente, comando, isGroup) {
  const nivelUsuario = await obterNivelUsuario(sock, chatId, remetente);
  const nivelNecessario = PERMISSOES_COMANDOS[comando] || NIVEIS.MEMBRO;

  // Bloqueado não tem permissão alguma
  if (nivelUsuario === NIVEIS.BLOQUEADO) return false;

  return nivelUsuario >= nivelNecessario;
}

/**
 * Verifica se o token informado é válido para áreas restritas.
 * @param {string} tokenRecebido
 * @returns {boolean}
 */
function validarToken(tokenRecebido) {
  return String(tokenRecebido || "").trim() === config.TOKEN_GRUPO;
}

module.exports = {
  NIVEIS,
  obterNivelUsuario,
  verificarPermissao,
  validarToken,
};
