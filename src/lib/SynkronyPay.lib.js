const t2lib = require("@affidaty/t2-lib");
const fetch = import("node-fetch");

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

function submitPaymentBulkTransaction(bulkB58, config) {
  let baseUrl = process.env.baseUrl
  const bulk = new t2lib.BulkTransaction()
  return bulk.fromBase58(bulkB58).then(() => {
    return bulk.sign(config.account.privateKey).then(() => bulk.toBase58())
  }).then(b58SignedTx => {
    return fetch(`${baseUrl}/v1/component/pay/sendPaymentBulk`, { method: "POST", data: {bulk: b58SignedTx}}).then(res => res.json())
  }).then(response => {
    return response.json()
  })
}

module.exports = {createIntent, submitPaymentBulkTransaction};