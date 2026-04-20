const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;

// Inicializa o estado das 50 mesas
let estadoMesas = {}; 
for(let i=1; i<=50; i++) {
    estadoMesas[i] = { ativa: false, acao: '', quantidade: 0, hora: '', atendida: false };
}

// Rotas de Páginas
app.get('/mesa/:numero', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/painel', (req, res) => res.sendFile(path.join(__dirname, 'painel.html')));

// Cliente envia chamado
app.post('/enviar-chamado', (req, res) => {
    const { mesa, acao } = req.body;
    if(estadoMesas[mesa]) {
        estadoMesas[mesa].ativa = true;
        estadoMesas[mesa].atendida = false;
        estadoMesas[mesa].acao = acao;
        estadoMesas[mesa].quantidade += 1;
        estadoMesas[mesa].hora = new Date().toLocaleTimeString('pt-BR');
    }
    res.status(200).json({ message: "OK" });
});

// Painel busca estado de todas as mesas
app.get('/obter-estado-geral', (req, res) => res.json(estadoMesas));

// Gerente dá OK (Feedback para o cliente)
app.post('/atender/:mesa', (req, res) => {
    const m = req.params.mesa;
    if(estadoMesas[m]) estadoMesas[m].atendida = true;
    setTimeout(() => { if(estadoMesas[m]) estadoMesas[m].atendida = false; }, 10000);
    res.send("OK");
});

// Gerente limpa a mesa (Volta ao estado livre)
app.post('/limpar/:mesa', (req, res) => {
    const m = req.params.mesa;
    estadoMesas[m] = { ativa: false, acao: '', quantidade: 0, hora: '', atendida: false };
    res.send("OK");
});

// Cliente checa se foi atendido
app.get('/status-atendimento/:mesa', (req, res) => {
    res.json({ atendido: estadoMesas[req.params.mesa]?.atendida || false });
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.listen(PORT, () => console.log(`Servidor Mapa 50 rodando na porta ${PORT}`));
