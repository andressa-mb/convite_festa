const express = require('express');
const router = express.Router();
const festaController = require('./festaController');

router.get('/convidados-lista', festaController.getConvidados);
router.get('/convidados', festaController.getConvidadoPorNome);
router.post('/convidados', festaController.addConvidado);
router.get('/presentes-lista', festaController.getPresentes);
router.post('/presentes', festaController.addPresente);
router.get('/presentesId/:presenteId', festaController.getPresentePorId);
router.put('/presentes/:presenteId', festaController.atualizarPresente);
router.put('/presentesQtd/:presenteId', festaController.atualizarPresenteQtd);

module.exports = router;