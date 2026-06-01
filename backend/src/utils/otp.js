const crypto = require('crypto');

const generateOtp = () => String(crypto.randomInt(100000, 999999));

const hashOtp = (otp) => crypto.createHash('sha256').update(String(otp)).digest('hex');

module.exports = { generateOtp, hashOtp };
