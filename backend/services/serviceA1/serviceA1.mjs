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

mongoose.connect('mongodb+srv://admin:imOqQwov7NKs6XlF@sistemasdistribuidosbc.sippfyt.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(express.json());

app.get('/servicea1', async (req, res) => {
    try{
        const registros = await Registro.find();
        res.json(registros);
    } catch (e) {
        console.log(e.message);
        res.status(e.status);
    }
});

app.post('/servicea1', async (req, res) => {
    try{
        console.log("req: ", req);
        const { a, b } = req.body;
        const microservice = 'A';
        const timestamp = Math.floor(Date.now() / 1000);
        const resultado = Math.pow(a, b);

        console.log(timestamp);
    
        const novoRegistro = new Registro({ timestamp, a, b, resultado, microservice });
        await novoRegistro.save();
    
        res.status(201).json(novoRegistro);
    } catch (e) {
        console.log(e.message);
        res.status(e.status);
    }
});

const PORT = process.env.PORT || 9091;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});