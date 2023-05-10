const jwt = require("jsonwebtoken");
function generateJwtToken(KEY, time) {
    return jwt.sign(KEY, process.env.ACCESS_TOKEN_KEY);
}

module.exports = { generateJwtToken }