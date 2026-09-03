const UsuarioDAO = require('../config/database');



const jwt = require('jsonwebtoken');

// --- 1. REGISTRO / CADASTRO ---
exports.register = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Preencha todos os campos.' });
  }

  // Lógica de cadastro (simulação)
  return res.status(201).json({ 
    success: true, 
    message: 'Usuário cadastrado com sucesso!', 
    redirectTo: '/login' 
  });
};

// --- 2. LOGIN ---
exports.login = (req, res) => {
  const { email, password } = req.body;

  // Lógica temporária de simulação de banco de dados
  if (email === 'usuario@teste.com' && password === '123456') {
    
    // Cria o token assinado contendo dados públicos do usuário
    const token = jwt.sign(
      { email: email }, 
      process.env.JWT_SECRET || 'chave_secreta_provisoria', 
      { expiresIn: '1h' }
    );

    // Anexa o token à resposta do servidor na forma de um Cookie Seguro
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // troque para true quando o projeto tiver HTTPS
      maxAge: 3600000 // expira em 1 hora (em ms)
    });

    // Responde com status positivo e diz para onde o frontend deve ir
    return res.status(200).json({ success: true, redirectTo: '/loading' });
  }

  return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
};

// --- 3. VALIDAÇÃO DO CÓDIGO DE REDEFINIÇÃO ---
exports.verifyResetCode = (req, res) => {
  const { email, code } = req.body;

  if (code === '123456') {
    // Cookie temporário de 15 minutos para autorizar o acesso à tela /newPassword
    const resetToken = jwt.sign(
      { email, purpose: 'reset' },
      process.env.JWT_SECRET || 'chave_secreta_verazo',
      { expiresIn: '15m' }
    );

    res.cookie('resetToken', resetToken, {
      httpOnly: true,
      secure: false,
      maxAge: 900000
    });

    return res.status(200).json({ success: true, redirectTo: '/newPassword' });
  }

  return res.status(400).json({ message: 'Código de redefinição inválido.' });
};

// --- 4. GRAVAÇÃO DA NOVA SENHA ---
exports.resetPassword = (req, res) => {
  const { newPassword, confirmPassword } = req.body;

  if (!newPassword || !confirmPassword) {
    return res.status(400).json({ message: 'Preencha todos os campos.' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'As senhas não coincidem.' });
  }

  // Remove o cookie temporário após alterar a senha com sucesso
  res.clearCookie('resetToken');

  return res.status(200).json({ 
    success: true, 
    message: 'Senha alterada com sucesso! Faça login com sua nova senha.',
    redirectTo: '/login' 
  });
};