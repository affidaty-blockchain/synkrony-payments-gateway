const commandLineArgs = require('command-line-args')
const optionDefinitions = [
    { name: 'env', alias: 'e' ,type: String}
  ]
const options = commandLineArgs(optionDefinitions)
require('dotenv').config({ path: `.env.${options.env}` });
  
const config = require(process.env.configFile);
const express = require('express');

const bodyParser = require('body-parser');
const cors = require('cors');

const SynkronyPayLib = require("./lib/SynkronyPay.lib.js");


const app = express();
app.use(express.static('example'))
const port = 3333;

app.use(cors());


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/createIntent', (req, res) => {
    const args = req.body;
    SynkronyPayLib.createIntent(args, config)
    .then(result => res.json({status:200,paymentObject:result}))
    .catch(error => {
        res.status(400)
        res.json({status:400,error})
    })
    
});

app.post('/submitPayment', (req, res) => {
    const args = req.body;
    SynkronyPayLib.submitPaymentBulkTransaction(args, config)
    .then(result => res.json({status:200,paymentObject:result}))
    .catch(error => {
        res.status(400)
        return res.json({status:400,error})
    })
    
});

/*
uncomment this to use example
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/example/index.html');
  });
*/
app.listen(port, () => console.log(`SynkronyPay app listening on port ${port}!`));