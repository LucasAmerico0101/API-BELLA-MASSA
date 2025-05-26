const db = require('../config/db');

const CouponModel = {
  async create({ codigo, percentual, validade, uso_unico = false, id_cliente = null }) {
    const query = `
      INSERT INTO cupom (codigo, percentual, validade, uso_unico, id_cliente, usado)
      VALUES (?, ?, ?, ?, ?, 0)`;
    const [result] = await db.execute(query, [codigo, percentual, validade, uso_unico, id_cliente]);
    return result.insertId;
  },

  async findByCodigo(codigo) {
    const query = `SELECT * FROM cupom WHERE codigo = ?`;
    const [rows] = await db.execute(query, [codigo]);
    return rows[0] || null;
  },

  async marcarComoUsado(id) {
    const query = `UPDATE cupom SET usado = 1 WHERE id = ?`;
    await db.execute(query, [id]);
  },

  async listarPorCliente(id_cliente) {
    const query = `SELECT * FROM cupom WHERE id_cliente = ?`;
    const [rows] = await db.execute(query, [id_cliente]);
    return rows;
  }
};

module.exports = CouponModel; 