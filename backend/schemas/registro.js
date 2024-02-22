import mongoose from 'mongoose';

const registroSchema = new mongoose.Schema({
    timestamp: { type: Number, required: true },
    a: { type: Number, required: true },
    b: { type: Number, required: true },
    resultado: { type: Number, required: true },
    microservice: { type: String, required: true }
});

const Registro = mongoose.model('Registro', registroSchema);

export default Registro;