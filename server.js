const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;

// Estado das 50 mesas (O que o gerente vê)
let mesas = {}; 
for(let i=1; i<=50; i++) {
    mesas[i] = { ativa: false, acao: '', qtd: 0, ok: false };
}

// Rotas principais
app.get('/mesa/:n', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/painel', (req, res) => res.sendFile(path.join(__dirname, 'painel.html')));

// Receber chamado (O clique do celular)
app.post('/enviar-chamado', (req, res) => {
    const { mesa, acao } = req.body;
    const n = parseInt(mesa);
    if(mesas[n]) {
        mesas[n].ativa = true;
        mesas[n].ok = false;
        mesas[n].acao = acao;
        mesas[n].qtd += 1;
    }
    res.json({ status: "sucesso" });
});

// Enviar estado para o Painel
app.get('/obter-estado', (req, res) => res.json(mesas));

// Gerente dá OK
app.post('/atender/:n', (req, res) => {
    const n = parseInt(req.params.n);
    if(mesas[n]) mesas[n].ok = true;
    setTimeout(() => { if(mesas[n]) mesas[n].ok = false; }, 8000);
    res.send("OK");
});

// Gerente limpa a mesa
app.post('/limpar/:n', (req, res) => {
    const n = parseInt(req.params.n);
    mesas[n] = { ativa: false, acao: '', qtd: 0, ok: false };
    res.send("OK");
});

// Cliente checa retorno
app.get('/status/:n', (req, res) => {
    const n = parseInt(req.params.n);
    res.json({ atendido: mesas[n]?.ok || false });
});

app.listen(PORT, () => console.log("Servidor Online"));
