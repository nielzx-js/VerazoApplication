const UsuarioDAO = require('../dao/usuarioDAO');



const jwt = require('jsonwebtoken');

// --- 1. REGISTRO / CADASTRO ---
exports.register = async (req, res) => {
  try {
    const { nome, email, password, confirmPassword } = req.body;

    if (!nome || !email || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'Preencha todos os campos.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'As senhas não coincidem.' });
    }

    const usuarioExistente = await UsuarioDAO.buscarPorEmail(email);
    if (usuarioExistente) {
      return res.status(400).json({ success: false, message: 'email já cadastrado.' });
    }

    await UsuarioDAO.criar(nome, email, password);

    return res.status(201).json({ 
      success: true, 
      message: 'Usuário cadastrado com sucesso!', 
      redirectTo: '/login' 
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    return res.status(500).json({ success: false, message: 'Erro interno no servidor ao registrar.' });
  }
};

// --- 2. LOGIN ---
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Preencha e-mail e senha.' });
    }

    const usuario = await UsuarioDAO.buscarPorEmail(email);

    if (!usuario || usuario.senha !== password) {
      return res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email }, 
      process.env.JWT_SECRET || 'chave_secreta_provisoria', 
      { expiresIn: '1h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      maxAge: 3600000
    });

    return res.status(200).json({ 
      success: true, 
      message: 'Login realizado com sucesso!', 
      redirectTo: '/loading' 
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ success: false, message: 'Erro interno no servidor ao fazer login.' });
  }
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