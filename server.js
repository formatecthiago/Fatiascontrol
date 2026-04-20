const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;

let chamados = [];

// Rota Cliente
app.get('/mesa/:numero', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota Gerente
app.get('/painel', (req, res) => {
    res.sendFile(path.join(__dirname, 'painel.html'));
});

// Enviar chamado
app.post('/enviar-chamado', (req, res) => {
    const { mesa, acao } = req.body;
    const novoChamado = { 
        id: Date.now(), 
        mesa, 
        acao, 
        hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) 
    };
    chamados.push(novoChamado);
    res.status(200).json({ message: "OK" });
});

app.get('/obter-chamados', (req, res) => {
    res.json(chamados);
});

app.delete('/resolver-chamado/:id', (req, res) => {
    const id = parseInt(req.params.id);
    chamados = chamados.filter(c => c.id !== id);
    res.status(200).send("OK");
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
