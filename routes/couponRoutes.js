const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');

router.post('/criar', couponController.criarCupom);
router.post('/validar', couponController.validarCupom);
router.get('/cliente/:id_cliente', couponController.listarCuponsPorCliente);

module.exports = router; 