const MenuService = require('../services/MenuService');

// Buscar todos os sabores de pizza
const getSabores = async (req, res) => {
  try {
    const sabores = await MenuService.getSabores();
    res.json(sabores);
  } catch (error) {
    console.error('Erro ao listar sabores:', error);
    res.status(500).json({ message: 'Erro ao listar sabores.' });
  }
};

// Buscar sabor por ID
const getSaborById = async (req, res) => {
  const { id } = req.params;
  try {
    const sabor = await MenuService.getSaborById(id);
    if (!sabor) {
      return res.status(404).json({ message: 'Sabor não encontrado.' });
    }
    res.json(sabor);
  } catch (error) {
    console.error('Erro ao buscar sabor:', error);
    res.status(500).json({ message: 'Erro ao buscar sabor.' });
  }
};

// Buscar todas as bebidas
const getBebidas = async (req, res) => {
  try {
    const bebidas = await MenuService.getBebidas();
    res.json(bebidas);
  } catch (error) {
    console.error('Erro ao listar bebidas:', error);
    res.status(500).json({ message: 'Erro ao listar bebidas.' });
  }
};

// Buscar todas as pizzas
const getPizzas = async (req, res) => {
  try {
    const pizzas = await MenuService.getPizzas();
    res.json(pizzas);
  } catch (error) {
    console.error('Erro ao listar pizzas:', error);
    res.status(500).json({ message: 'Erro ao listar pizzas.' });
  }
};

// Adicionar um sabor de pizza
const addSabor = async (req, res) => {
  const { nome, preco } = req.body;
  try {
    const response = await MenuService.addSabor(nome, preco);
    res.status(201).json(response);
  } catch (error) {
    console.error('Erro ao adicionar sabor:', error);
    res.status(500).json({ message: 'Erro ao adicionar sabor.' });
  }
};

// Adicionar uma bebida
const addBebida = async (req, res) => {
  const { imagem_url, nome, tamanho, preco, id_pedido } = req.body;
  try {
    const response = await MenuService.addBebida(imagem_url, nome, tamanho, preco, id_pedido);
    res.status(201).json(response);
  } catch (error) {
    console.error('Erro ao adicionar bebida:', error);
    res.status(500).json({ message: 'Erro ao adicionar bebida.' });
  }
};

// Adicionar uma pizza
const addPizza = async (req, res) => {
  const { imagem_url, tipo_borda, preco_borda, tamanho, observacao, id_pedido, sabores } = req.body;
  try {
    const response = await MenuService.addPizza(imagem_url, tipo_borda, preco_borda, tamanho, observacao, id_pedido, sabores);
    res.status(201).json(response);
  } catch (error) {
    console.error('Erro ao adicionar pizza:', error);
    res.status(500).json({ message: 'Erro ao adicionar pizza.' });
  }
};

module.exports = {
  getSabores,
  getSaborById,
  getBebidas,
  getPizzas,
  addSabor,
  addBebida,
  addPizza
};
