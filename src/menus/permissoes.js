// ==============================================
// LARI MYSTIC BOT - CONTROLE DE PERMISSÕES E NÍVEIS
// ==============================================

const config = require("../config");
const logger = require("../utils/logger");
const { extrairNumero, limparNumero } = require("../utils/helpers");

const NIVEIS = {
  DONO: 100,
  ADMIN: 80,
  MODERADOR: 50,
  MEMBRO: 10,
  BLOQUEADO: 0,
};

const PERMISSOES_COMANDOS = {
  menu: NIVEIS.MEMBRO,
  carta: NIVEIS.MEMBRO,
  ajuda: NIVEIS.MEMBRO,
  sobre: NIVEIS.MEMBRO,
  perfil: NIVEIS.MEMBRO,
  dados: NIVEIS.MEMBRO,
  "pedra-papel-tesoura": NIVEIS.MEMBRO,
  "cara-ou-coroa": NIVEIS.MEMBRO,
  ban: NIVEIS.MODERADOR,
  mute: NIVEIS.MODERADOR,
  desmute: NIVEIS.MODERADOR,
  adv: NIVEIS.MODERADOR,
  rmadv: NIVEIS.MODERADOR,
  listmods: NIVEIS.MODERADOR,
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
  token: NIVEIS.DONO,
  "modo-manutencao": NIVEIS.DONO,
  "zerar-tudo": NIVEIS.DONO,
  broadcast: NIVEIS.DONO,
  "ver-logs": NIVEIS.DONO,
};

async function obterNivelUsuario(sock, chatId, remetente) {
  const numeroDono = limparNumero(config.DONO);
  const numeroRemetente = limparNumero(extrairNumero(remetente));

  if (numeroDono && numeroRemetente === numeroDono) {
    return NIVEIS.DONO;
  }

  if (!chatId.endsWith("@g.us")) {
    return NIVEIS.MEMBRO;
  }

  try {
    const grupoMetadata = await sock.groupMetadata(chatId);
    const participantes = grupoMetadata.participants || [];

    const participante = participantes.find(
      (p) => limparNumero(p.id) === numeroRemetente
    );

    if (!participante) return NIVEIS.MEMBRO;

    if (participante.admin === "superadmin" || participante.admin === "admin") {
      return NIVEIS.ADMIN;
    }
  } catch (err) {
    logger.warn(`Não foi possível verificar admin do grupo: ${err.message}`);
  }

  return NIVEIS.MEMBRO;
}

async function verificarPermissao(sock, chatId, remetente, comando, isGroup) {
  const nivelUsuario = await obterNivelUsuario(sock, chatId, remetente);
  const nivelNecessario = PERMISSOES_COMANDOS[comando] || NIVEIS.MEMBRO;

  if (nivelUsuario === NIVEIS.BLOQUEADO) return false;

  return nivelUsuario >= nivelNecessario;
}

function validarToken(tokenRecebido) {
  return String(tokenRecebido || "").trim() === config.TOKEN_GRUPO;
}

module.exports = {
  NIVEIS,
  obterNivelUsuario,
  verificarPermissao,
  validarToken,
};
