// ==============================================
// LARI MYSTIC BOT - MODELOS DE DADOS (MongoDB)
// ==============================================

const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * Modelo de Grupo do WhatsApp.
 */
const GrupoSchema = new Schema({
  jid: { type: String, required: true, unique: true },
  nome: { type: String, default: "" },
  token: { type: String, default: "" },
  protecoes: { type: Map, of: Boolean, default: {} },
  listaNegraLocal: [{ type: String }],
  ativo: { type: Boolean, default: true },
  criadoEm: { type: Date, default: Date.now },
});

/**
 * Modelo de Usuário do WhatsApp.
 */
const UsuarioSchema = new Schema({
  jid: { type: String, required: true, unique: true },
  nome: { type: String, default: "" },
  nivel: { type: Number, default: 10 },
  banidoGlobalmente: { type: Boolean, default: false },
  exp: { type: Number, default: 0 },
  ouro: { type: Number, default: 0 },
  personagemRPG: {
    nome: { type: String, default: "Aventureiro" },
    nivel: { type: Number, default: 1 },
    hp: { type: Number, default: 100 },
    hpMax: { type: Number, default: 100 },
    ataque: { type: Number, default: 10 },
    defesa: { type: Number, default: 5 },
  },
  criadoEm: { type: Date, default: Date.now },
});

/**
 * Modelo de Resenha (venda).
 */
const ResenhaSchema = new Schema({
  titulo: { type: String, required: true },
  itens: [{ type: String }],
  pagamentos: [{
    data: { type: Date, default: Date.now },
    pagoPor: { type: String },
    valor: { type: Number, default: 0 },
  }],
  criadaPor: { type: String, required: true },
  criadaEm: { type: Date, default: Date.now },
});

/**
 * Modelo de Log.
 */
const LogSchema = new Schema({
  timestamp: { type: Date, default: Date.now },
  acao: { type: String, required: true },
  detalhes: { type: Schema.Types.Mixed, default: {} },
});

const Grupo = mongoose.model("Grupo", GrupoSchema);
const Usuario = mongoose.model("Usuario", UsuarioSchema);
const Resenha = mongoose.model("Resenha", ResenhaSchema);
const Log = mongoose.model("Log", LogSchema);

module.exports = { Grupo, Usuario, Resenha, Log };
