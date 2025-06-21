const db = require("../config/db");
const bcrypt = require('bcrypt');

const UserService = {
    async createUser(nome, email, senha, telefone, data_nascimento, cep, rua, bairro, cidade, estado, tipo_endereco, numero, complemento) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const hashedPassword = await bcrypt.hash(senha, 10);

    // Cria o cliente primeiro
    const clienteQuery = `
      INSERT INTO cliente (nome, telefone, data_nascimento, email, data_registro) 
      VALUES (?, ?, ?, ?, CURRENT_DATE())`;
    const [clienteResult] = await connection.execute(clienteQuery, [nome, telefone, data_nascimento, email]);

    const clienteId = clienteResult.insertId;
    if (!clienteId) throw new Error('Erro ao criar cliente');

    // Agora cria o endereço vinculado ao cliente
    const addressQuery = `
      INSERT INTO endereco (rua, numero, tipo_endereco, bairro, complemento, cidade, estado, cep, cliente_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    await connection.execute(addressQuery, [rua, numero, tipo_endereco, bairro, complemento, cidade, estado, cep, clienteId]);

    await connection.commit();

    return { 
      success: true, 
      message: 'Cliente e endereço cadastrados com sucesso!',
      id_cliente: clienteId // <-- Adicione isso
    };
  } catch (error) {
    await connection.rollback();
    throw new Error('Erro ao criar cliente: ' + error.message);
  } finally {
    connection.release();
  }
},

    async getUserById(userId) {
        try {
            const query = `
                SELECT c.id_cliente, c.nome, c.email, c.telefone, c.data_nascimento, c.data_registro, 
                       e.id_endereco, e.rua, e.numero, e.tipo_endereco, e.bairro, e.complemento, e.cidade, e.estado, e.cep
                FROM cliente c
                LEFT JOIN endereco e ON e.cliente_id = c.id_cliente
                WHERE c.id_cliente = ?`;

            const [rows] = await db.execute(query, [userId]);

            if (rows.length === 0) {
                throw new Error('Cliente não encontrado');
            }

            return rows[0];
        } catch (error) {
            throw new Error('Erro ao buscar cliente: ' + error.message);
        }
    },

    async updateUser(userId, { nome, email, telefone }) {
    try {
        // Garante que não há valores undefined (que causam erro no mysql2)
        nome = nome ?? null;
        email = email ?? null;
        telefone = telefone ?? null;

        const query = `
            UPDATE cliente
            SET nome = ?, email = ?, telefone = ?
            WHERE id_cliente = ?`;

        const [result] = await db.execute(query, [nome, email, telefone, userId]);

        if (result.affectedRows === 0) {
            throw new Error('Cliente não encontrado para atualizar');
        }

        return await this.getUserById(userId);
    } catch (error) {
        throw new Error('Erro ao atualizar cliente: ' + error.message);
    }
}
};
/**
 * @typedef {Object} User
 * @property {number} id_cliente - ID do cliente
 * @property {string} nome - Nome do cliente
 * @property {string} email - Email do cliente
 * @property {string} telefone - Telefone do cliente
 * @property {string} data_nascimento - Data de nascimento do cliente
 * @property {string} data_registro - Data de registro do cliente
 * @property {number} id_endereco - ID do endereço
 * @property {string} rua - Rua do endereço
 * @property {string} numero - Número do endereço
 * @property {string} tipo_endereco - Tipo de endereço (residencial, comercial, etc.)
 * @property {string} bairro - Bairro do endereço
 * @property {string} complemento - Complemento do endereço
 * @property {string} cidade - Cidade do endereço
 * @property {string} estado - Estado do endereço
 * @property {string} cep - CEP do endereço
 */

module.exports = UserService;
