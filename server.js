
const express = require('express');
const path = require('path');
const app = express();
// 1. Configura o servidor para entender dados enviados por formulários (pedidos)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// 2. Serve todos os arquivos estáticos (CSS, imagens, JS, etc.)
app.use(express.static(__dirname));
const PORT = process.env.PORT || 3000;
// 3. ROTA DO CLIENTE (Mesa): O QR Code vai abrir isso
// Exemplo: ://onrender.com
app.get('/mesa/:numero', (req, res) => {
  // Aqui o servidor "sabe" qual é a mesa pelo parâmetro :numero
  res.sendFile(path.join(__dirname, 'index.html'));
});
// 4. ROTA DO GERENTE: O funcionário abre isso
// Link: ://onrender.com
app.get('/painel', (req, res) => {
  res.sendFile(path.join(__dirname, 'painel.html'));
});
// 5. Rota padrão (caso alguém digite o link puro)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
