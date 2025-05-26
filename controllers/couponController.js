const CouponModel = require('../models/CouponModel');
const gerarCodigoCupom = require('../utils/couponCodeGenerator');

const criarCupom = async (req, res) => {
  try {
    const { percentual, validade, uso_unico, id_cliente } = req.body;
    const codigo = gerarCodigoCupom();
    const id = await CouponModel.create({ codigo, percentual, validade, uso_unico, id_cliente });
    res.status(201).json({ id, codigo });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar cupom', error: error.message });
  }
};

const validarCupom = async (req, res) => {
  try {
    const { codigo } = req.body;
    const cupom = await CouponModel.findByCodigo(codigo);
    if (!cupom) return res.status(404).json({ message: 'Cupom não encontrado' });
    if (cupom.usado) return res.status(400).json({ message: 'Cupom já utilizado' });
    const hoje = new Date();
    if (cupom.validade && new Date(cupom.validade) < hoje) return res.status(400).json({ message: 'Cupom expirado' });
    res.json({ valido: true, percentual: cupom.percentual });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao validar cupom', error: error.message });
  }
};

const listarCuponsPorCliente = async (req, res) => {
  try {
    const { id_cliente } = req.params;
    const cupons = await CouponModel.listarPorCliente(id_cliente);
    res.json(cupons);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar cupons', error: error.message });
  }
};

module.exports = { criarCupom, validarCupom, listarCuponsPorCliente }; 