const express = require('express');
const router = express.Router();
const festaController = require('./festaController');

router.get('/convidados-lista', festaController.getConvidados);
router.get('/convidados/:convidadoNome', festaController.getConvidadoPorNome);
router.post('/convidados', festaController.addConvidado);
router.get('/presentes-lista', festaController.getPresentes);
router.post('/presentes', festaController.addPresente);
router.get('/convidados/:presenteId', festaController.getPresentePorId);
router.put('/presentes/:presenteId', festaController.atualizarPresente);

module.exports = router;