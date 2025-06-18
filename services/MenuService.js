const db = require('../config/db');


// Buscar todos os sabores de pizza
const getSabores = async () => {
  try {
    const query = `SELECT * FROM sabor`;
    const [rows] = await db.query(query);
    return rows;
  } catch (error) {
    throw new Error('Erro ao listar sabores: ' + error.message);
  }
};


// Buscar todas as bebidas
const getBebidas = async () => {
  try {
    const query = `SELECT * FROM bebida`;
    const [rows] = await db.query(query);
    return rows;
  } catch (error) {
    throw new Error('Erro ao listar bebidas: ' + error.message);
  }
};


// Adicionar um sabor de pizza
const addSabor = async (nome, preco) => {
  try {
    const query = `INSERT INTO sabor (nome, preco) VALUES (?, ?)`;
    await db.query(query, [nome, preco]);
   res.json({ success: true, message: "Produto cadastrado com sucesso!" });
  } catch (error) {
    throw new Error('Erro ao adicionar sabor: ' + error.message);
  }
};


// Adicionar uma bebida
const addBebida = async (imagem_url, nome, tamanho, preco, id_pedido) => {
  try {
    const query = `INSERT INTO bebida (imagem_url, nome, tamanho, preco, id_pedido) VALUES (?, ?, ?, ?, ?)`;
    await db.query(query, [imagem_url, nome, tamanho, preco, id_pedido]);
    res.json({ success: true, message: "Produto cadastrado com sucesso!" });
  } catch (error) {
    throw new Error('Erro ao adicionar bebida: ' + error.message);
  }
};


// Adicionar uma pizza
const addPizza = async (imagem_url, tipo_borda, preco_borda, tamanho, observacao, id_pedido, sabores) => {
  const conn = await db.getConnection(); // se estiver usando pool de conexões
  try {
    await conn.beginTransaction();

    // 1. Insere a pizza (agora com imagem_url)
    const pizzaQuery = `INSERT INTO pizza (imagem_url, tipo_borda, preco_borda, tamanho, observacao) VALUES (?, ?, ?, ?, ?)`;
    const [pizzaResult] = await conn.query(pizzaQuery, [imagem_url, tipo_borda, preco_borda, tamanho, observacao]);
    const id_pizza = pizzaResult.insertId;

    // 2. Associa os sabores à pizza
    const pizzaSaborQuery = `INSERT INTO pizza_sabor (id_pizza, id_sabor) VALUES (?, ?)`;
    for (const id_sabor of sabores) {
      await conn.query(pizzaSaborQuery, [id_pizza, id_sabor]);
    }

    await conn.commit();
    return { success: true, message: "Produto cadastrado com sucesso!" };
  } catch (error) {
    await conn.rollback();
    throw new Error('Erro ao adicionar pizza: ' + error.message);
  } finally {
    conn.release();
  }
};


const getSaborById = async (id_sabor) => {
  try {
    const query = `SELECT * FROM sabor WHERE id_sabor = ?`;
    const [rows] = await db.query(query, [id_sabor]);
    return rows[0] || null;
  } catch (error) {
    throw new Error('Erro ao buscar sabor: ' + error.message);
  }
};


const getPizzas = async () => {
  try {
    const query = `
      SELECT 
        p.id_pizza,
        p.imagem_url,
        p.tipo_borda,
        p.preco_borda,
        p.tamanho,
        p.observacao,
        s.nome AS sabor,
        s.preco AS preco_sabor
      FROM pizza p
      JOIN pizza_sabor ps ON p.id_pizza = ps.id_pizza
      JOIN sabor s ON ps.id_sabor = s.id_sabor
    `;
    const [rows] = await db.query(query);
    return rows;
  } catch (error) {
    throw new Error('Erro ao listar pizzas: ' + error.message);
  }
};


module.exports = { getSabores, getBebidas, addSabor, addBebida, addPizza, getSaborById, getPizzas };
