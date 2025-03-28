const presenteModel = require("../model/presente.model");
const convidadoModel = require("../model/convidado.model");

const normalizeString = (str) => {
  return str
    .normalize("NFD") // Separa caracteres acentuados em base + acento
    .replace(/[\u0300-\u036f]/g, "") // Remove os acentos
    .replace(/ç/g, "c") // Substitui 'ç' por 'c'
    .toLowerCase(); // Converte para minúsculas
};

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
    const nomes = req.query.nomes; 
    
    if (!nomes) {
      return res.status(400).json({ error: "Nenhum nome foi enviado" });
    }

    const nomesNormalizados = nomes.map(nome => normalizeString(nome));

    // Busca todos os convidados do banco
    const convidados = await convidadoModel.find();
    
    // Filtra os que têm algum nome correspondente
    const convidadosFiltrados = convidados.filter(convidado =>
      convidado.convidado.some(nome => 
        nomesNormalizados.includes(normalizeString(nome))
      )
    );

    if (convidadosFiltrados.length > 0) {
      const ids = convidadosFiltrados.map(convidado => convidado.convidadoId);
      return res.status(200).json({ ids });
    }
    
    return res.status(204).json({ message: "Convidado não encontrado" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar convidados", details: err.message, receivedData: req.params });
  }
}

//só funciona com um array de convidados, se enviar vários convidados (vários arrays) não funciona
async function addConvidado(req, res) { 
    try {
        let {convidado}  = req.body;
        if (!convidado || convidado.length === 0) {
          return res.status(400).json({ error: "O campo 'convidado' é obrigatório e deve conter pelo menos um nome válido." });
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
      let { convidadoId, nomePresente, quantidadePresente } = req.body;

      const presente = await presenteModel.findOne({ presenteId });
      if (!presente) {
          return res.status(404).json({ error: "Presente não encontrado" });
      }
   
      if(quantidadePresente){
        presente.quantidade = quantidadePresente;
      }

      if (presente.quantidade > 0) {
          presente.quantidade -= 1;
      } else {
          return res.status(400).json({ error: "Presente esgotado: " + presente.nomePresente });
      }


      if (nomePresente) {
        presente.nomePresente = nomePresente;
    }

      presente.convidadoId = [...presente.convidadoId, ...convidadoId];

      const presenteAtualizado = await presente.save();
      res.status(200).json(presenteAtualizado);
  
  } catch (err) {
      res.status(500).json({ error: "Erro ao atualizar presente", details: err.message });
  }
}

async function atualizarPresenteQtd(req, res) {
  try {
      const { presenteId } = req.params;
      let { convidadoId, nomePresente, quantidadePresente } = req.body;

      const presente = await presenteModel.findOne({ presenteId });
      if (!presente) {
          return res.status(404).json({ error: "Presente não encontrado" });
      }
   
      if(quantidadePresente){
        presente.quantidade = quantidadePresente;
      }


      if (nomePresente) {
        presente.nomePresente = nomePresente;
    }

      presente.convidadoId = [...presente.convidadoId, ...convidadoId];

      const presenteAtualizado = await presente.save();
      res.status(200).json(presenteAtualizado);
  
  } catch (err) {
      res.status(500).json({ error: "Erro ao atualizar presente", details: err.message });
  }
}



module.exports = { getConvidados, addConvidado, getConvidadoPorNome, getPresentes, getPresentePorId, addPresente, atualizarPresente, atualizarPresenteQtd };