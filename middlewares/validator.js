const { validationResult, body } = require('express-validator');

// Middleware para validar os resultados da validação
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: {
        message: 'Dados inválidos',
        details: errors.array()
      }
    });
  }
  next();
};

// Regras de validação para usuário
const userValidationRules = {
  register: [
    body('nome').trim().notEmpty().withMessage('Nome é obrigatório'),
    body('email').isEmail().withMessage('Email inválido'),
    body('senha')
      .isLength({ min: 6 })
      .withMessage('Senha deve ter no mínimo 6 caracteres'),
    body('telefone').optional,
    body('endereco').optional,
    body('numero_casa').optional,
    body('cidade').optional,
    body('estado').optional,
    body('cep').optional
  ],
  login: [
    body('email').isEmail().withMessage('Email inválido'),
    body('senha').notEmpty().withMessage('Senha é obrigatória')
  ]
};

// Regras de validação para pedido
const orderValidationRules = {
  create: [
    body('id_cliente').notEmpty().withMessage('ID do cliente é obrigatório'),
    body('total').isNumeric().withMessage('Total deve ser um número'),
    body('metodo_pagamento').notEmpty().withMessage('Método de pagamento é obrigatório'),
    body('tipo_entrega').notEmpty().withMessage('Tipo de entrega é obrigatório'),
    body('id_endereco').notEmpty().withMessage('ID do endereço é obrigatório'),
    body('pizzas').isArray().withMessage('Pizzas deve ser um array'),
    body('bebidas').isArray().withMessage('Bebidas deve ser um array')
  ],
  updateStatus: [
    body('id_pedido').notEmpty().withMessage('ID do pedido é obrigatório'),
    body('status').notEmpty().withMessage('Status é obrigatório')
  ]
};

module.exports = {
  validate,
  userValidationRules,
  orderValidationRules
}; 