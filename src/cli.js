const commandLineArgs = require('command-line-args')
const optionDefinitions = [
    { name: 'env', alias: 'e' ,type: String},
    { name: 'cmd', alias: 'c', type: String },
    { name: 'args', alias: 'a' ,type: String},
    
  ]
const options = commandLineArgs(optionDefinitions)
require('dotenv').config({ path: `.env.${options.env}` });



const config = require(process.env.configFile);

const SynkronyPayLib = require("./lib/SynkronyPay.lib.js");


switch (options.cmd) {
    case "createIntent" : 
        SynkronyPayLib.createIntent(JSON.parse(options.args), config)
        .then(result => console.log({status:200,paymentObject:result}))
        .catch(error => console.log({status:400,error}));
    break;
    case "submitPayment" :
      SynkronyPayLib.submitPaymentBulkTransaction(JSON.parse(options.args), config)
      .then(result => console.log({status:200,paymentObject:result}))
      .catch(error => console.log({status:400,error}));
    break;
}