const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.static(__dirname));
const PORT = process.env.PORT || 3000;
let estadoMesas = {}; 
for(let i=1; i<=50; i++) { estadoMesas[i] = { ativa: false, acao: '', quantidade: 0, atendida: false }; }
app.get('/mesa/:numero', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/painel', (req, res) => res.sendFile(path.join(__dirname, 'painel.html')));
app.post('/enviar-chamado', (req, res) => {
    const { mesa, acao } = req.body;
    const m = parseInt(mesa);
    if(estadoMesas[m]) { estadoMesas[m].ativa = true; estadoMesas[m].atendida = false; estadoMesas[m].acao = acao; estadoMesas[m].quantidade += 1; }
    res.status(200).json({ message: "OK" });
});
app.get('/obter-estado-geral', (req, res) => res.json(estadoMesas));
app.post('/atender/:mesa', (req, res) => {
    const m = parseInt(req.params.mesa);
    if(estadoMesas[m]) { estadoMesas[m].atendida = true; estadoMesas[m].ativa = false; }
    setTimeout(() => { if(estadoMesas[m]) estadoMesas[m].atendida = false; }, 8000);
    res.send("OK");
});
app.post('/limpar/:mesa', (req, res) => {
    const m = parseInt(req.params.mesa);
    estadoMesas[m] = { ativa: false, acao: '', quantidade: 0, atendida: false };
    res.send("OK");
});
app.get('/status-atendimento/:mesa', (req, res) => {
    const m = parseInt(req.params.mesa);
    res.json({ atendido: estadoMesas[m]?.atendida || false });
});
app.listen(PORT, () => console.log(`Servidor Jesus rodando na porta ${PORT}`));
