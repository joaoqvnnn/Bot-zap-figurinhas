// ==============================================
// LARI MYSTIC BOT - SERVIÇO DE GRUPO APRIMORADO
// ==============================================

const logger = require("../utils/logger");
const { mudarNomeGrupo, mudarDescricaoGrupo, obterLinkGrupo, abrirGrupo, fecharGrupo } = require("./groupServiceBase");

const groupService = {
  mudarNomeGrupo,
  mudarDescricaoGrupo,
  obterLinkGrupo,
  abrirGrupo,
  fecharGrupo,
};

module.exports = { groupService };
