const crypto = require('crypto');
const fs = require('fs')
// Generate RSA key pair
crypto.generateKeyPair('rsa', {
    modulusLength: 2048,  // Length of the key in bits
    publicKeyEncoding: {
        type: 'spki',     // Recommended to use 'spki' for public keys
        format: 'pem'     // Encoding format
    },
    privateKeyEncoding: {
        type: 'pkcs8',    // Recommended to use 'pkcs8' for private keys
        format: 'pem',    // Encoding format
        cipher: 'aes-256-cbc',  // Optional: encryption cipher for private key
        passphrase: ''    // Optional: passphrase for encrypted private key
    }
}, (err, publicKey, privateKey) => {
    if (err) {
        console.error('Error generating keys:', err);
    } else {
        fs.writeFileSync('certs/private.pem', privateKey)
        fs.writeFileSync('certs/public.pem', publicKey)
    }
});
