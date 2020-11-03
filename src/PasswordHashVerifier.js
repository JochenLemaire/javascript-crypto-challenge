const nacl = require('libsodium-wrappers');
module.exports = async () => {
    await nacl.ready;

    return Object.freeze({
        verify: (hashedPw, pw) => {
            let test = nacl.crypto_pwhash_str_verify(hashedPw, pw);

            return test;
        }

    })
}