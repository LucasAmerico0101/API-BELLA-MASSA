const CouponModel = require('../models/CouponModel');
const gerarCodigoCupom = require('../utils/couponCodeGenerator');

const criarCupom = async ({ percentual, validade, uso_unico, id_cliente }) => {
  const codigo = gerarCodigoCupom();
  return await CouponModel.create({ codigo, percentual, validade, uso_unico, id_cliente });
};

const validarCupom = async (codigo) => {
  const cupom = await CouponModel.findByCodigo(codigo);
  if (!cupom) throw new Error('Cupom não encontrado');
  if (cupom.usado) throw new Error('Cupom já utilizado');
  const hoje = new Date();
  if (cupom.validade && new Date(cupom.validade) < hoje) throw new Error('Cupom expirado');
  return cupom;
};

module.exports = { criarCupom, validarCupom }; 