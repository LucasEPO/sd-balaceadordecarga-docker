import express from 'express';
import mongoose from 'mongoose';

const registroSchema = new mongoose.Schema({
    timestamp: { type: Number, required: true },
    a: { type: Number, required: true },
    b: { type: Number, required: true },
    resultado: { type: Number, required: true },
    microservice: { type: String, required: true }
});

const Registro = mongoose.model('Registro', registroSchema);

mongoose.connect('mongodb+srv://admin:bSMH0YE7HpwE9hw9@sistemasdistribuidosbc.sippfyt.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(express.json());

app.get('/servicea2', async (req, res) => {
    const registros = await Registro.find();
    res.json(registros);
});

app.post('/servicea2', async (req, res) => {
    console.log('ps2');
    const { a, b } = req.body;
    const microservice = "A'";
    const timestamp = Math.floor(Date.now() / 1000);
    const resultado = Math.pow(b, a);
    console.log('ps2>1');
    
    const novoRegistro = new Registro({ timestamp, a, b, resultado, microservice });
    console.log('ps2>r');
    console.log(novoRegistro);
    await novoRegistro.save();
    console.log('ps2>s');

    res.status(201).json(novoRegistro);
});

const PORT = process.env.PORT || 9092;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});