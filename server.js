const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;

let chamados = [];
let atendidos = {}; 

// Rotas de Páginas
app.get('/mesa/:numero', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/painel', (req, res) => res.sendFile(path.join(__dirname, 'painel.html')));
app.get('/gerar', (req, res) => res.sendFile(path.join(__dirname, 'qrcode_generator.html')));

// API: Receber chamado da mesa
app.post('/enviar-chamado', (req, res) => {
    const { mesa, acao } = req.body;
    const novo = { id: Date.now(), mesa, acao, hora: new Date().toLocaleTimeString('pt-BR') };
    chamados.push(novo);
    atendidos[mesa] = false; 
    res.status(200).json({ message: "OK" });
});

// API: Painel busca chamados
app.get('/obter-chamados', (req, res) => res.json(chamados));

// API: Gerente confirma e avisa o cliente
app.delete('/resolver-chamado/:id/:mesa', (req, res) => {
    const { id, mesa } = req.params;
    chamados = chamados.filter(c => c.id != id);
    atendidos[mesa] = true; 
    // O aviso de "Atendido" dura 10 segundos no servidor
    setTimeout(() => { atendidos[mesa] = false; }, 10000); 
    res.status(200).send("OK");
});

// API: Cliente checa se o gerente deu OK
app.get('/status-atendimento/:mesa', (req, res) => {
    res.json({ atendido: atendidos[req.params.mesa] || false });
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
