const mongoose = require("mongoose");
// Modelo do Presente
const PresenteSchema = new mongoose.Schema({
    presenteId: { type: Number, required: true, unique: true },
    nomePresente: { type: String, required: true },
    precoSugerido: { type: Number },
    quantidade: { type: Number, required: true },
    convidadoId: { type: [Number], default: [] }
});


const presenteModel = mongoose.model("Presente", PresenteSchema);

module.exports = presenteModel;