const OrderService = require('../services/OrderService');
const UserModel = require('../models/UserModel');
const CouponModel = require('../models/CouponModel');

// Criar um pedido
const createOrder = async (req, res) => {
  const { id_cliente, total, metodo_pagamento, tipo_entrega, observacoes, id_endereco, pizzas, bebidas, cupom } = req.body;

  try {
    // Busca usuário para verificar aniversário
    const usuario = await UserModel.findById(id_cliente);
    let pizzasAtualizadas = [...pizzas];
    let desconto = 0;
    let mensagem = '';

    // Lógica de pizza grátis de aniversário
    if (usuario && usuario.data_nascimento_cliente) {
      const hoje = new Date();
      const dataNasc = new Date(usuario.data_nascimento_cliente);
      if (hoje.getDate() === dataNasc.getDate() && hoje.getMonth() === dataNasc.getMonth()) {
        // Adiciona uma pizza grátis (exemplo: tamanho 'media', sabor id 1)
        pizzasAtualizadas.push({ tipo_borda: null, preco_borda: 0, tamanho: 'media', observacao: 'Pizza grátis de aniversário', sabores: [1] });
        mensagem += 'Parabéns! Você ganhou uma pizza grátis de aniversário. ';
      }
    }

    // Lógica de cupom
    if (cupom) {
      const cupomData = await CouponModel.findByCodigo(cupom);
      if (!cupomData) return res.status(400).json({ message: 'Cupom inválido.' });
      if (cupomData.usado) return res.status(400).json({ message: 'Cupom já utilizado.' });
      const hoje = new Date();
      if (cupomData.validade && new Date(cupomData.validade) < hoje) return res.status(400).json({ message: 'Cupom expirado.' });
      desconto = (total * (cupomData.percentual / 100));
      mensagem += `Cupom aplicado: ${cupomData.percentual}% de desconto. `;
      await CouponModel.marcarComoUsado(cupomData.id);
    }

    const totalFinal = total - desconto;

    const response = await OrderService.createOrder(
      id_cliente, totalFinal, metodo_pagamento, tipo_entrega, observacoes, id_endereco, pizzasAtualizadas, bebidas
    );
    res.status(201).json({ ...response, desconto, mensagem });
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({ message: 'Erro ao criar pedido.' });
  }
};

const getOrdersByClient = async (req, res) => {
  const { id_cliente } = req.params;

  try {
    const orders = await OrderService.getOrdersByClient(id_cliente);
    res.json(orders);
  } catch (error) {
    console.error('Erro ao obter pedidos:', error);
    res.status(500).json({ message: 'Erro ao obter pedidos.' });
  }
};

const updateOrderStatus = async (req, res) => {
  const { id_pedido, status } = req.body;

  const statusPermitidos = ['pendente', 'em_preparo', 'entregue', 'cancelado'];
  if (!statusPermitidos.includes(status)) {
    return res.status(400).json({ 
      message: 'Status inválido. Valores permitidos: pendente, em_preparo, entregue, cancelado' 
    });
  }

  try {
    const response = await OrderService.updateOrderStatus(id_pedido, status);
    res.json(response);
  } catch (error) {
    console.error('Erro ao atualizar status do pedido:', error);
    res.status(500).json({ message: 'Erro ao atualizar status do pedido.' });
  }
};

const getOrderDetails = async (req, res) => {
  const { id_pedido } = req.params;
  try {
    const orderDetails = await OrderService.getOrderDetails(id_pedido);

    if (!orderDetails || (orderDetails.pizzas.length === 0 && orderDetails.bebidas.length === 0)) {
      return res.status(404).json({ message: 'Pedido não encontrado ou sem itens.' });
    }

    res.json(orderDetails);
  } catch (error) {
    console.error('Erro ao obter detalhes do pedido:', error);
    res.status(500).json({ message: 'Erro ao obter detalhes do pedido.' });
  }
};

const updatePizza = async (req, res) => {
  const { id_pizza, id_pedido } = req.params;
  const { tipo_borda, preco_borda, tamanho, observacao, sabores } = req.body;

  try {
    const response = await OrderService.updatePizza(
      id_pizza, id_pedido, tipo_borda, preco_borda, tamanho, observacao, sabores
    );
    res.json(response);
  } catch (error) {
    console.error('Erro ao atualizar pizza:', error);
    res.status(500).json({ message: 'Erro ao atualizar pizza.' });
  }
};

const updateBebida = async (req, res) => {
  const { id_bebida, id_pedido } = req.params;
  const { nome, tamanho, preco } = req.body;

  try {
    const response = await OrderService.updateBebida(id_bebida, id_pedido, nome, tamanho, preco);
    res.json(response);
  } catch (error) {
    console.error('Erro ao atualizar bebida:', error);
    res.status(500).json({ message: 'Erro ao atualizar bebida.' });
  }
};

const removePizza = async (req, res) => {
  const { id_pizza, id_pedido } = req.params;
  try {
    const response = await OrderService.removePizza(id_pizza, id_pedido);
    res.json(response);
  } catch (error) {
    console.error('Erro ao remover pizza:', error);
    res.status(500).json({ message: 'Erro ao remover pizza.' });
  }
};

const removeBebida = async (req, res) => {
  const { id_bebida, id_pedido } = req.params;
  try {
    const response = await OrderService.removeBebida(id_bebida, id_pedido);
    res.json(response);
  } catch (error) {
    console.error('Erro ao remover bebida:', error);
    res.status(500).json({ message: 'Erro ao remover bebida.' });
  }
};

module.exports = {
  createOrder,
  getOrdersByClient,
  updateOrderStatus,
  getOrderDetails,
  updatePizza,
  updateBebida,
  removePizza,
  removeBebida
};
