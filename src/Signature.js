const nacl = require('libsodium-wrappers')

module.exports = async () => {
    await nacl.ready;

    let kp = nacl.crypto_sign_keypair();

    return Object.freeze({

        verifyingKey: kp.publicKey,

        sign: (msg) => {
            let sm;
            
            sm = nacl.crypto_sign(msg, kp.privateKey);

            return sm;
        }
    })
}