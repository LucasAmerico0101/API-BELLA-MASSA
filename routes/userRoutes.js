const express = require('express');
const db = require('../config/db'); // Adicione esta linha
const router = express.Router();
const UserController = require('../controllers/userController');
const { authMiddleware,adminMiddleware } = require('../middlewares/auth');
const userController = require('../controllers/userController');
const registerAddress = require('../services/AuthService').registerAddress;

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Endpoints para cadastro e consulta de usuários
 */

/**
 * @swagger
 * /api/users/cadastro:
 *   post:
 *     summary: Cadastra um novo usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - senha
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *               telefone:
 *                 type: string
 *               data_nascimento:
 *                 type: string
 *                 format: date
 *               cep:
 *                 type: string
 *               rua:
 *                 type: string
 *               bairro:
 *                 type: string
 *               cidade:
 *                 type: string
 *               estado:
 *                 type: string
 *               tipo_endereco:
 *                 type: string
 *               numero:
 *                 type: string
 *               complemento:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário cadastrado
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno
 *
 * /api/users/cliente/{id}:
 *   get:
 *     summary: Busca um usuário pelo ID
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno
 */

// Rotas públicas
router.post('/cadastro', UserController.register); 

// Rota para retornar os dados do usuário autenticado
router.get('/me', authMiddleware, userController.getProfile);
router.put('/me', authMiddleware, userController.updateProfile);

// Rotas protegidas por autenticação
router.get('/cliente/:id', authMiddleware, UserController.getUser); 
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const [users] = await db.query('SELECT id_cliente, nome, email, cpf, telefone, data_nascimento, role FROM cliente');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar usuários' });
  }
});
router.post('/endereco', authMiddleware, async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const { endereco: rua, numero, complemento, bairro, cep, cidade, estado, tipo_endereco } = req.body;
    
    // Verificação básica dos campos obrigatórios
    if (!rua || !numero || !bairro || !cep) {
      return res.status(400).json({ error: { message: 'Campos obrigatórios faltando' } });
    }

    await db.execute(
      'INSERT INTO endereco (rua, numero, complemento, bairro, cep, cidade, estado, tipo_endereco, cliente_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [rua, numero, complemento || null, bairro, cep, cidade || null, estado || null, tipo_endereco || 'residencial', usuarioId]
    );

    res.json({ message: 'Endereço cadastrado com sucesso!' });
  } catch (error) {
    console.error('Erro ao cadastrar endereço:', error);
    res.status(500).json({ error: { message: 'Erro interno ao cadastrar endereço' } });
  }
});
router.get('/endereco', authMiddleware, async (req, res) => {
  try {
    const usuarioId = req.user.id;

    const [enderecos] = await db.query(
      'SELECT * FROM endereco WHERE cliente_id = ?',
      [usuarioId]
    );

    res.json(enderecos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar endereços do usuário' });
  }
});

module.exports = router;
