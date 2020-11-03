const nacl = require('libsodium-wrappers');
const Decryptor = require('./Decryptor.js');
const Encryptor = require('./Encryptor.js');

module.exports = async (peer) => {
    await nacl.ready;
    const kx_pair = nacl.crypto_kx_keypair();
    let otherPeer = peer, encryptor, decryptor, sessionKeys, msgs;


    let obj = Object.freeze({
        publicKey: kx_pair.publicKey,

        generateSharedKeys: async (obj) => {
            sessionKeys = nacl.crypto_kx_client_session_keys(kx_pair.publicKey, kx_pair.privateKey, obj.publicKey)
            encryptor = await Encryptor(sessionKeys.sharedTx)
            decryptor = await Decryptor(sessionKeys.sharedRx)
            otherPeer = obj;
        },


        encrypt: (msg) => {
             return encryptor.encrypt(msg);
        },

        decrypt: (cipherText, nonce) => {
            return decryptor.decrypt(cipherText, nonce);
        },

        send: (msg) => {
            otherPeer.addMsg(obj.encrypt(msg));
        },

        receive: () => {
            let msg = obj.decrypt(msgs.ciphertext, msgs.nonce);
            return msg;
        },

        addMsg: (msg) => {
            msgs = msg;
        }
    })

    if (otherPeer) {
        sessionKeys = nacl.crypto_kx_server_session_keys(kx_pair.publicKey, kx_pair.privateKey, otherPeer.publicKey);
        otherPeer.generateSharedKeys(obj)
        encryptor = await Encryptor(sessionKeys.sharedTx);
        decryptor = await Decryptor(sessionKeys.sharedRx);
    }

    return obj;
}