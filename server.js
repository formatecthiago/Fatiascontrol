const express = require('express');
const path = require('path');
const app = express();

// Serve todos os arquivos da pasta principal (CSS, imagens, JS do navegador)
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;

// Rota principal que entrega o seu index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});