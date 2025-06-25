const CouponModel = require('../models/CouponModel');
const gerarCodigoCupom = require('../utils/couponCodeGenerator');

const criarCupom = async (req, res) => {
  try {
    const { percentual, validade, uso_unico, id_cliente, valor_minimo, dias_validos } = req.body;
    const codigo = gerarCodigoCupom();
    await CouponModel.create({
      codigo,
      percentual,
      validade,
      uso_unico,
      id_cliente,
      valor_minimo,
      dias_validos: JSON.stringify(dias_validos)
    });
    res.status(201).json({ codigo });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar cupom', error: error.message });
  }
};

const validarCupom = async (req, res) => {
  try {
    const { codigo } = req.body;
    const cupom = await CouponModel.findByCodigo(codigo);

    const valorCompra = req.body.valorCompra; // valor total da compra

    // Verifica valor mínimo
    if (cupom.valor_minimo && valorCompra < cupom.valor_minimo) {
      return res.status(400).json({ message: 'Cupom válido apenas para compras acima de R$ ' + cupom.valor_minimo });
    }

    // Verifica dia da semana
    const hoje = new Date();
    const diaSemana = hoje.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
    const diasValidos = typeof cupom.dias_validos === 'string' ? JSON.parse(cupom.dias_validos) : cupom.dias_validos;

    if (diasValidos && !diasValidos.includes(diaSemana)) {
      return res.status(400).json({ message: 'Cupom não é válido para hoje' });
    }

    if (!cupom) return res.status(404).json({ message: 'Cupom não encontrado' });
    if (cupom.usado) return res.status(400).json({ message: 'Cupom já utilizado' });
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