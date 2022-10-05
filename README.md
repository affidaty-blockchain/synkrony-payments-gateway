# SynkronyPay Merchant lib

Tool for creating a aggregated gateway to accept cryptocurrencies as a payment system.
# Introduction

Synkrony Pay is a payment gateway application that allows e-commerce, applications and developers to implement a crypto checkout payment. 
With Synkrony Pay, you can pay everything you want with your 4RYA wallet, public chain or classic payment.
## Getting started

Follow the documentation [here](https://affidaty-s-p-a.gitbook.io/synkrony-pay/)

# Usage as local server

This tool can be used as Express server, this is the most common method to use the library.
Merchant Backend can use this tool via REST CALL locally without exposing ports to the public network.
nderapprovala
- edit **./src/SynkronyPayConfig.json** with your credentials
- run npm api (or 'api:dev' to use this tool in testnet environment)

This tool expose two different api endpoint:

 - 'POST http://localhost:3333/createIntent'

 ```json 

{
  "main": { "sign": "#BTC", "units": 1000000 },
  "other": [{ "sign": "#EURS", "units": 1000 }],
  "payload": {"yourItem" : "yourValue"}
}

```

take the result and use it as input parameter of PayComponent in browser

```javascript
 window.SynkronyPay.pay(json.paymentObject).then(payComponentResponse => {
   // send the result to your server to sign & submit stransaction
 });
```

- 'POST http://localhost:3333/submitPayment'

 ```json 

{
    "paymentId": "dataResultFromPayComponent.paymentId",
    "bulkNode": "dataResultFromPayComponent.bulkNode" , 
    "bulkRoot": "dataResultFromPayComponent.bulkRoot"
}

```

**Note:** for Bitcoin, you must use "Satoshi" value : <span style="color:green">**1**</span> BTX = <span style="color:green">**1**</span> x 10<sup>8</sup> Satoshi

**Note:** for Euros, you must use "Cents" value : <span style="color:green">**1**</span> EURO = <span style="color:green">**1**</span> x 100 Cents

**Note:** It's possible to fill "payload" with an object that contains any information, the payment system sends this object in each webhook, cart datail, payment id, or all e-commerce stuff can be stored to recovery the cart from webhook.


# Usage as batch command

This tool can be used as cli command.
Merchant Backend can use this tool as a shell command (batch) passing args as a json string.

- edit **./src/SynkronyPayConfig.json** with your credentials

For each payment run in shell:
```shell
node ./src/cli.js -c createIntent -e dev (or -e prod) -a '{"main": { "sign": "#BTC", "units": 1000000 },"other": [{ "sign": "#EURS", "units": 1000 }],"payload": {"yourItem" : "yourValue"}}'
```
take the result and use it as input parameter of PayComponent in browser

```javascript
 window.SynkronyPay.pay(json.paymentObject).then(payComponentResponse => {
   // send the result to your server to sign & submit stransaction
 });
```

```shell
node ./src/cli.js -c submitPayment -e dev (or -e prod) -a '{"paymentId": "dataResultFromPayComponent.paymentId","bulkNode": "dataResultFromPayComponent.bulkNode" , "bulkRoot": "dataResultFromPayComponent.bulkRoot"}'
```


**Note:** for Bitcoin, you must use "Satoshi" value : <span style="color:green">**1**</span> BTX = <span style="color:green">**1**</span> x 10<sup>8</sup> Satoshi

**Note:** for Euros, you must use "Cents" value : <span style="color:green">**1**</span> EURO = <span style="color:green">**1**</span> x 100 Cents

**Note:** you can fill "payload" with an object that contains any information, payment system take care about send this object in each webhook, you can store cart datail, payment id, or all e-commerce stuff that you need to recovery the cart from webhook.




