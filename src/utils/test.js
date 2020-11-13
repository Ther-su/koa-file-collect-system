const crypto = require('crypto');
 
function aesEncrypt(data, key) {
    const cipher = crypto.createCipher('aes192', key);
    var crypted = cipher.update(data, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}
 
function aesDecrypt(encrypted, key) {
    const decipher = crypto.createDecipher('aes192', key);
    var decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
 
var data = '12345';
var key = 'Password!';
//var encrypted = aesEncrypt(data, key);
// var decrypted = aesDecrypt(encrypted, key);
 
// console.log('Plain text: ' + data);
// console.log('Encrypted text: ' + encrypted);
// console.log('Decrypted text: ' + decrypted);
console.log(aesEncrypt('1',key))
console.log(aesEncrypt('123456',key))