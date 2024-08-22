// local package for visual cryptography

// AES encryption and decryption key
const crypto_key = "z^~K1[NT8g?0";

// functions to encrypt and decrypt
function encrypt(image) {
    return CryptoJS.AES.encrypt(image, crypto_key).toString();
}

function decrypt(encryptedImage) {
    const bytes = CryptoJS.AES.decrypt(encryptedImage, crypto_key);
    return bytes.toString(CryptoJS.enc.Utf8);
}

// function to create shares
function splitShares(input, N, K) {
    const inputLength = input.length;
    const shareLength = Math.ceil(inputLength / K);
    const shares = [];

    for (let i = 0; i < K - 1; i++) {
        shares.push(input.slice(shareLength * i, shareLength * (i + 1)));
    }
    
    shares.push(input.slice(shareLength * (K - 1)));

    for (let i = K; i < N; i++) {
        let randomShare = '';
        for (let j = 0; j < shareLength; j++) {
            randomShare += String.fromCharCode(Math.floor(Math.random() * 128));
        }
        shares.push(randomShare);
    }

    return shares;
}

// function to reassemble shares received
function reassembleShares(shares, K) {
    const inputLength = shares[0].length * K;
    let input = '';
    for (let i = 0; i < K; i++) {
        input += shares[i];
    }
    return input.slice(0, inputLength);
}

// function to split image into shares
function splitImageToShares(image){
    const encodedImage = image.split(',')[1];
    cipher = encrypt(encodedImage);
    shares = splitShares(cipher,N,K);
    return shares;
}

// function to re assemble shares into image
function reassembleSharesToImage(shares){
    cipher = reassembleShares(shares,K);
    image = decrypt(cipher);
    return image;
}