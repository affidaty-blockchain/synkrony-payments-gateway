const { BulkNodeTransaction, BulkRootTransaction } = require("@affidaty/t2-lib");
const t2lib = require("@affidaty/t2-lib");
const fetch = require("node-fetch");

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

function createIntent({main = {sign: "#BTC", "units": 0 },other= [], payload = {}, uuid = makeid(27)}, config) {
    return new Promise((resolve,reject) => {
      const expireDate = new Date().getTime() + config.paymentConfig.timeToExpire * 1000
      const paymentData = {
        assets: {main, other},
        payment: {
          uuid,
          licenseId: config.paymentConfig.licenseId, 
          webhook: config.paymentConfig.webhook,
          currency: config.paymentConfig.currency,
          successUrl: config.paymentConfig.successUrl,
          cancelUrl: config.paymentConfig.cancelUrl ,
          userPayFees: config.paymentConfig.userPayFees
        },
        expireDate: expireDate,
        publicKey: config.account.publicKey,
        appName: config.paymentConfig.appName,
        payload
    };
      
    const signable = new t2lib.Signable();
    signable.data = paymentData
    const privateKey = new t2lib.ECDSAKey("private");
    privateKey.importBin(new Uint8Array(t2lib.binConversions.base58ToBuffer(config.account.privateKey))).then(() => {
      return signable.sign(privateKey)
    }).then(() => {
        resolve(signable.toBase58())
    }).catch(reject)
  })
}

async function submitPaymentBulkTransaction({bulkNode, bulkRoot}, config) {
  return new Promise(async (resolve, reject) => {
    let baseUrl = process.env.baseUrl
    const node = new BulkNodeTransaction()
    const root = new BulkRootTransaction()
    const bulk = new t2lib.BulkTransaction()
    const privateKey = new t2lib.ECDSAKey("private");
    await node.fromBase58(bulkNode)
    await root.fromBase58(bulkRoot)
    bulk.data.root = root
    bulk.data.nodes.push(node)
    await privateKey.importBin(new Uint8Array(t2lib.binConversions.base58ToBuffer(config.account.privateKey)))
    await bulk.sign(privateKey)
    const b58SignedTx = await bulk.toBase58()
    console.log(b58SignedTx)
    fetch(`${baseUrl}/v1/component/pay/sendPaymentBulk`, { method: 'POST', body: JSON.stringify({bulk: b58SignedTx}),headers: { 
      'Content-Type': 'application/json',
      'synpayauth': `${config.synkronypayAuthorizedDomain};${config.synkronypayAPIKey}`
    } })
    .then(res => res.json())
    .then(json => resolve(json))
    .catch(reject)
  })
}

module.exports = {createIntent, submitPaymentBulkTransaction};