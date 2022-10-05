require('dotenv').config()
const config = require(process.env.configFile);
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const SynkronyPayLib = require("./lib/SynkronyPay.lib.js");


const app = express();
const port = 3333;

app.use(cors());


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/createIntent', (req, res) => {
    const args = req.body;
    console.log(config)
    SynkronyPayLib.createIntent(args, config)
    .then(result => res.json({status:200,paymentObject:result}))
    .catch(error => res.json({status:400,error}))
    
});

app.post('/submitPayment', (req, res) => {
    const args = req.body;
    SynkronyPayLib.submitPaymentBulkTransaction(args, config)
    .then(result => res.json({status:200,paymentObject:result}))
    .catch(error => res.json({status:400,error}))
    
});

app.listen(port, () => console.log(`SynkronyPay app listening on port ${port}!`));