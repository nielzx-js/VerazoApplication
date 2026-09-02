// backend/src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // 1. Extrai o cookie da requisição recebida
  const token = req.cookies.token;

  // 2. Se não houver token, o acesso é negado imediatamente
  if (!token) {
    return res.redirect('/login');
  }

  try {
    // 3. Valida se o token foi assinado pela sua chave secreta e se ainda é válido
    const tokenDecodificado = jwt.verify(token, process.env.JWT_SECRET || 'chave_secreta_provisoria');
    
    // 4. Salva os dados do usuário decodificados dentro do objeto da requisição
    req.user = tokenDecodificado;
    
    // 5. Permite que a requisição siga para a próxima etapa (a rota)
    next();
  } catch (error) {
    // Se o token foi adulterado ou expirou, limpa o cookie inválido e redireciona
    res.clearCookie('token');
    res.clearCookie('resetToken');
    return res.redirect('/login');
  }
};
