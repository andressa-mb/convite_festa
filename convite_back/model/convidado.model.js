const mongoose = require("mongoose");
//modelo de convidado

const ConvidadoSchema = new mongoose.Schema({
  convidadoId: { type: Number, unique: true, required: true },
  convidado: { type: [String], required: true }
});
const convidadoModel = mongoose.model("Convidado", ConvidadoSchema);
module.exports = convidadoModel;