
// Array para armazenar os chamados ativos (na memória)
let chamados = [];
// Rota para a mesa enviar o chamado
app.post('/enviar-chamado', (req, res) => {
    const { mesa, acao } = req.body;
    const novoChamado = { mesa, acao, hora: new Date().toLocaleTimeString() };
    chamados.push(novoChamado);
    console.log(`Alerta: Mesa ${mesa} solicitou ${acao}`);
    res.status(200).json({ message: "Chamado enviado!" });
});
// Rota para o Painel do Controlador buscar os chamados
app.get('/obter-chamados', (req, res) => {
    res.json(chamados);
});
