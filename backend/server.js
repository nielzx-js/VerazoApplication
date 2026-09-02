// backend/server.js
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const viewRoutes = require('./src/routes/viewRoutes');
const authRoutes = require('./src/routes/authRoutes');

const app = express();

// Middlewares globais do servidor
app.use(express.json()); // Permite ler corpo de requisições em formato JSON
app.use(cookieParser()); // Permite ler cookies das requisições recebidas

// Serve estilos CSS e Imagens de forma estática e pública
app.use('/style', express.static(path.join(__dirname, '../frontend/style')));
app.use('/images', express.static(path.join(__dirname, '../frontend/images')));

// Registra os módulos de rotas na aplicação
app.use('/api/auth', authRoutes); // Exemplo de acesso: POST /api/auth/login
app.use('/', viewRoutes);         // Rotas de interface (ex: GET /login, GET /loading)

const PORTA = 3000;
app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});