const CouponModel = require('../models/CouponModel');
const gerarCodigoCupom = require('../utils/couponCodeGenerator');

async function criarCupom({ codigo, percentual, validade, uso_unico, id_cliente, valor_minimo, dias_validos }) {
  const query = `
    INSERT INTO cupom (codigo, percentual, validade, uso_unico, id_cliente, valor_minimo, dias_validos)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  await db.execute(query, [
    codigo,
    percentual,
    validade,
    uso_unico,
    id_cliente,
    valor_minimo,
    JSON.stringify(dias_validos)
  ]);
}

async function validarCupom(codigo, valorCompra) {
  const [rows] = await db.execute('SELECT * FROM cupom WHERE codigo = ?', [codigo]);
  const cupom = rows[0];
  if (!cupom) throw new Error('Cupom não encontrado');

  // Verifica valor mínimo
  if (cupom.valor_minimo && valorCompra < cupom.valor_minimo) {
    throw new Error('Cupom válido apenas para compras acima de R$ ' + cupom.valor_minimo);
  }

  // Verifica dia da semana
  const hoje = new Date();
  const diaSemana = hoje.getDay(); // 0=domingo, 1=segunda, ...
  const diasValidos = typeof cupom.dias_validos === 'string' ? JSON.parse(cupom.dias_validos) : cupom.dias_validos;
  if (diasValidos && !diasValidos.includes(diaSemana)) {
    throw new Error('Cupom não é válido para hoje');
  }

  return cupom;
}

module.exports = { criarCupom, validarCupom };