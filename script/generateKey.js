const crypto = require("crypto");
const fs = require("fs");
// Generate RSA key pair
const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048, // Length of the key in bits
    publicKeyEncoding: {
        type: "pkcs1", // Recommended to use 'spki' for public keys
        format: "pem", // Encoding format
    },
    privateKeyEncoding: {
        type: "pkcs1", // Recommended to use 'pkcs8' for private keys
        format: "pem", // Encoding format
    },
});

fs.writeFileSync("certs/private.pem", privateKey);
fs.writeFileSync("certs/public.pem", publicKey);
// console.log(privateKey,publicKey);
