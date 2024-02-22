import express from 'express';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 9093;

let requests = 0;
console.log(requests);

app.post('/bc', async (req, res) => {
    requests++;
    console.log("rq:", req);

    let servicePort, service;
    if (requests % 2 === 0) {
        servicePort = 9091; 
        service = 'servicea1';
    } else {
        servicePort = 9092; 
        service = 'servicea2';
    }
    const postData = req.body;
    console.log("pd:", postData);

    try {
        const response = await axios.post(`http://localhost:${servicePort}/${service}`, postData);
        console.log(response.data); 
        res.status(response.status).send(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor de balanceamento de carga rodando na porta ${PORT}`);
});