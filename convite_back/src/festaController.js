const presenteModel = require("../model/presente.model");
const convidadoModel = require("../model/convidado.model");

async function getConvidados(req, res) {
  try {
    const convidados = await convidadoModel.find();
    res.status(200).json(convidados);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar convidados", details: err.message });
  }
}

async function getConvidadoPorNome(req, res) {
  try{
    const { convidadoNome } = req.params;
    let idSingular;

    const convidados = await convidadoModel.find({
      convidado: { $in: [convidadoNome] }
    });

    if (convidados.length > 0) {
      const ids = convidados.map(convidado => convidado.convidadoId);
      idSingular = ids;
      if(ids.length > 1){
        idSingular = ids[0];
      }
      return res.status(200).json({ idSingular });
    }

    return res.status(404).json({ error: "Convidado não encontrado" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar convidados", details: err.message });
  }
}

//só funciona com um array de convidados, se enviar vários convidados (vários arrays) não funciona
async function addConvidado(req, res) { 
    try {
        let {convidado}  = req.body;
        if (!convidado) {
          return res.status(400).json({ error: "O campo 'convidado' é obrigatório" });
        }
        
         if (typeof convidado === "string") {
          convidado = [convidado];
        } 
    
        const ultimoConvidado = await convidadoModel.findOne().sort({ convidadoId: -1 });
        const novoConvidadoId = ultimoConvidado ? ultimoConvidado.convidadoId + 1 : 1;
    
        const novoConvidado = new convidadoModel({
          convidadoId: novoConvidadoId,
          convidado: convidado
      });

        await novoConvidado.save();    
        res.status(201).json(novoConvidado);
    } catch (err) {
        res.status(500).json({ error: "Erro ao adicionar convidado", details: err.message });
    }

}

async function getPresentes(req, res) {
  try {
    const presentes = await presenteModel.find();
    res.status(200).json(presentes);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar presentes", details: err.message });
  }
}

async function getPresentePorId(req, res) {
  try {
    const { presenteId } = req.params;
    const presente = await presenteModel.findOne({ presenteId });
    if (!presente) {
      return res.status(404).json({ error: "Presente não encontrado" });
    }
    res.status(200).json(presente);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar presente", details: err.message });
  }
}

async function addPresente(req, res) {
  try {
    const presentes  = req.body;
    if (!Array.isArray(presentes)) {
      return res.status(400).json({ error: "Envie um array de presentes" });
    }

    const novosPresentes = await presenteModel.create(presentes);
    res.status(201).json(novosPresentes);
  } catch (err) {
    console.error("Erro ao adicionar presentes:", err);
    res.status(500).json({ error: "Erro ao adicionar presentes", details: err.message });
  }
}

async function atualizarPresente(req, res) {
  try {
      const { presenteId } = req.params;
      let { convidadoId } = req.body;

      const presente = await presenteModel.findOne({ presenteId });
      if (!presente) {
          return res.status(404).json({ error: "Presente não encontrado" });
      }

      if (presente.quantidade > 0) {
          presente.quantidade -= 1;
      } else {
          return res.status(400).json({ error: "Presente esgotado: " + presente.nomePresente });
      }

      presente.convidadoId = [...presente.convidadoId, convidadoId];

      const presenteAtualizado = await presente.save();
      res.status(200).json(presenteAtualizado);
  } catch (err) {
      res.status(500).json({ error: "Erro ao atualizar presente", details: err.message });
  }
}



module.exports = { getConvidados, addConvidado, getConvidadoPorNome, getPresentes, getPresentePorId, addPresente, atualizarPresente };