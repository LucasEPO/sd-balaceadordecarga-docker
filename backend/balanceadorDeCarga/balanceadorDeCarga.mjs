import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 9093;

app.use(bodyParser.json());
app.use(cors());

let requests = 0;

app.post('/bc', async (req, res) => {
    requests++;

    let serviceMainPort, serviceSecondaryPort, serviceMain, serviceSecondary;
    if (requests % 2 === 0) {
        serviceMainPort = 9091; 
        serviceMain = 'servicea1';
        serviceSecondaryPort = 9092; 
        serviceSecondary = 'servicea2';
    } else {
        serviceMainPort = 9092; 
        serviceMain = 'servicea2';
        serviceSecondaryPort = 9091; 
        serviceSecondary = 'servicea1';
    }
    const postData = req.body;

    try {
        //Tenta o servico correto para continuar dividindo 50%
        const response = await axios.post(`http://container_${serviceMain}:${serviceMainPort}/${serviceMain}`, postData);
        if(response && response.data && response.status){
            res.status(response.status).send(response.data);
        }
    } catch (error) {
        try{
            //caso não consiga tenta o outro serviço
            const response = await axios.post(`http://container_${serviceSecondary}:${serviceSecondaryPort}/${serviceSecondary}`, postData);
            if(response && response.data && response.status){
                res.status(response.status).send(response.data);
            }
        } catch(error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }
});

app.get('/bc', async (req, res) => {
    requests++;

    let serviceMainPort, serviceSecondaryPort, serviceMain, serviceSecondary;
    if (requests % 2 === 0) {
        serviceMainPort = 9091;
        serviceMain = 'servicea1';
        serviceSecondaryPort = 9092;
        serviceSecondary = 'servicea2';
    } else {
        serviceMainPort = 9092;
        serviceMain = 'servicea2';
        serviceSecondaryPort = 9091;
        serviceSecondary = 'servicea1';
    }

    try {
        const response = await axios.get(`http://container_${serviceMain}:${serviceMainPort}/${serviceMain}`);
        if (response && response.data && response.status) {
            res.status(response.status).send(response.data);
        }
    } catch (error) {
        try {
            const response = await axios.get(`http://container_${serviceSecondary}:${serviceSecondaryPort}/${serviceSecondary}`);
            if (response && response.data && response.status) {
                res.status(response.status).send(response.data);
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }
});

app.listen(PORT, () => {
    console.log(`Servidor de balanceamento de carga rodando na porta ${PORT}`);
});