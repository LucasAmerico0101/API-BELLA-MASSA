-- Active: 1750218885632@@127.0.0.1@3306
DROP DATABASE IF EXISTS pizzaria;
CREATE DATABASE pizzaria;
USE pizzaria;

-- Endereços
CREATE TABLE endereco (
    id_endereco INTEGER NOT NULL AUTO_INCREMENT,
    rua VARCHAR(100)  NULL,
    numero VARCHAR(10) NULL,
    tipo_endereco VARCHAR(30)  NULL,
    bairro VARCHAR(50)  NULL,
    complemento VARCHAR(50),
    cidade VARCHAR(50)  NULL,
    estado CHAR(2)  NULL,
    cep CHAR(8) NULL,
    cliente_id INTEGER not NULL,
    PRIMARY KEY (id_endereco),
    FOREIGN KEY (cliente_id) REFERENCES cliente(id_cliente)
);

-- Clientes
CREATE TABLE cliente (
    id_cliente INTEGER NOT NULL AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(15) NOT NULL,
    data_nascimento DATE NOT NULL,
    email VARCHAR(100) NOT NULL,
    data_registro DATE NOT NULL,
    email_confirmado BOOLEAN DEFAULT 0,
    email_token VARCHAR(255),
    id_endereco INTEGER DEFAULT NULL,
    cpf VARCHAR(11) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    role VARCHAR(15) NULL DEFAULT 'user',
    PRIMARY KEY (id_cliente),
    FOREIGN KEY (id_endereco) REFERENCES endereco(id_endereco)
);

-- Pedidos
CREATE TABLE pedido (
    id_pedido INTEGER NOT NULL AUTO_INCREMENT,
    data_pedido DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pendente', 'em preparo', 'entregue', 'cancelado') NOT NULL DEFAULT 'pendente',
    total DECIMAL(10,2) NOT NULL,
    tipo_entrega ENUM('retirada', 'delivery') NOT NULL,
    observacoes TEXT,
    horario_estimado TIME,
    id_cliente INTEGER NOT NULL,
    id_endereco INTEGER, -- necessário apenas se for diferente do endereço do cliente
    PRIMARY KEY (id_pedido),
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
    FOREIGN KEY (id_endereco) REFERENCES endereco(id_endereco)
);

-- Entregas
CREATE TABLE entrega (
    id_entrega INTEGER NOT NULL AUTO_INCREMENT,
    tempo_estimado INTEGER NOT NULL,
    id_pedido INTEGER NOT NULL,
    PRIMARY KEY (id_entrega),
    FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido)
);

-- Pagamentos (agora com método de pagamento apenas aqui)
CREATE TABLE pagamento (
    id_pagamento INTEGER NOT NULL AUTO_INCREMENT,
    data_pagamento DATE NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    metodo ENUM('dinheiro', 'cartao', 'pix') NOT NULL,
    id_pedido INTEGER NOT NULL,
    PRIMARY KEY (id_pagamento),
    FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido)
);

-- Sabores de Pizza
CREATE TABLE sabor (
    id_sabor INTEGER NOT NULL AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (id_sabor)
);

-- Pizzas (representa a pizza "física" feita no pedido)
CREATE TABLE pizza (
    imagem_url VARCHAR(255) NOT NULL,
    id_pizza INTEGER NOT NULL AUTO_INCREMENT,
    tipo_borda ENUM('tradicional', 'recheada', 'sem borda') NOT NULL,
    preco_borda DECIMAL(10,2) NOT NULL,
    tamanho ENUM('broto', 'media', 'grande') NOT NULL,
    observacao VARCHAR(200),
    PRIMARY KEY (id_pizza)
    
);

-- Pizza-Sabor (permite combinar sabores em uma pizza, ex: meio a meio)
CREATE TABLE pizza_sabor (
    id_pizza INTEGER NOT NULL,
    id_sabor INTEGER NOT NULL,
    PRIMARY KEY (id_pizza, id_sabor),
    FOREIGN KEY (id_pizza) REFERENCES pizza(id_pizza),
    FOREIGN KEY (id_sabor) REFERENCES sabor(id_sabor)
);

-- Bebidas
CREATE TABLE bebida (
    id_bebida INTEGER NOT NULL AUTO_INCREMENT,
    imagem_url VARCHAR(255) NOT NULL,
    nome VARCHAR(50) NOT NULL,
    tamanho ENUM('lata', '600ml', '1L', '2L') NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (id_bebida)
);

-- Avaliações
CREATE TABLE avaliacao (
    id_avaliacao INTEGER NOT NULL AUTO_INCREMENT,
    data_avaliacao DATE NOT NULL,
    nota INTEGER NOT NULL CHECK (nota BETWEEN 1 AND 5),
    comentario VARCHAR(200),
    resposta_loja VARCHAR(200),
    id_pedido INTEGER NOT NULL,
    id_cliente INTEGER NOT NULL,
    PRIMARY KEY (id_avaliacao),
    FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido),
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
);
use pizzaria;
CREATE TABLE cupom (
    id_cupom INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    percentual DECIMAL(5,2) NOT NULL,
    validade DATE NOT NULL,
    uso_unico BOOLEAN DEFAULT FALSE,
    id_cliente INT DEFAULT NULL,
    valor_minimo DECIMAL(10,2) DEFAULT NULL,
    dias_validos JSON DEFAULT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
);
ALTER TABLE cupom ADD COLUMN usado BOOLEAN DEFAULT FALSE;