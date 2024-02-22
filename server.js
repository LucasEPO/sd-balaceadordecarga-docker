const express = require('express');
const path = require('path');
const app = express();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
const PORT = process.env.PORT || 9090;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});