// ==============================================
// LARI MYSTIC BOT - BASE DO SERVIÇO DE GRUPO
// ==============================================

const logger = require("../utils/logger");

async function mudarNomeGrupo(sock, chatId, novoNome) {
  try {
    await sock.groupUpdateSubject(chatId, novoNome);
    return true;
  } catch (err) {
    logger.error(`Erro ao mudar nome: ${err.message}`);
    return false;
  }
}

async function mudarDescricaoGrupo(sock, chatId, novaDescricao) {
  try {
    await sock.groupUpdateDescription(chatId, novaDescricao);
    return true;
  } catch (err) {
    logger.error(`Erro ao mudar descrição: ${err.message}`);
    return false;
  }
}

async function obterLinkGrupo(sock, chatId) {
  try {
    const code = await sock.groupInviteCode(chatId);
    return code ? `https://chat.whatsapp.com/${code}` : null;
  } catch (err) {
    logger.error(`Erro ao obter link: ${err.message}`);
    return null;
  }
}

async function abrirGrupo(sock, chatId) {
  try {
    await sock.groupSettingUpdate(chatId, "not_announcement");
    return true;
  } catch (err) {
    logger.error(`Erro ao abrir grupo: ${err.message}`);
    return false;
  }
}

async function fecharGrupo(sock, chatId) {
  try {
    await sock.groupSettingUpdate(chatId, "announcement");
    return true;
  } catch (err) {
    logger.error(`Erro ao fechar grupo: ${err.message}`);
    return false;
  }
}

module.exports = {
  mudarNomeGrupo,
  mudarDescricaoGrupo,
  obterLinkGrupo,
  abrirGrupo,
  fecharGrupo,
};
