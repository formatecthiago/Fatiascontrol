let atendidos = {}; // Guarda o status de atendimento de cada mesa

// Rota para o gerente marcar como atendido
app.delete('/resolver-chamado/:id/:mesa', (req, res) => {
    const id = parseInt(req.params.id);
    const mesa = req.params.mesa;
    
    chamados = chamados.filter(c => c.id !== id);
    atendidos[mesa] = true; // Marca que a mesa foi visualizada
    
    setTimeout(() => { atendidos[mesa] = false; }, 5000); // Limpa o aviso após 5 segundos
    res.status(200).send("OK");
});

// Rota para o cliente verificar se foi atendido
app.get('/status-atendimento/:mesa', (req, res) => {
    const mesa = req.params.mesa;
    res.json({ atendido: atendidos[mesa] || false });
});
