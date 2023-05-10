const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
// -----------------------------------------------------------------------------

function authenticateUser(req, res, next) {

    const jwtTokens = req.cookies.jwt;
    const token = jwtTokens && jwtTokens.access_token;

    if (!token) {
        return res.send("Sorry you are not authorized.");
    }

    try {
        const jwtValid = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);

        if (jwtValid) next();
        else return res.send("Sorry you are not an authorized user");

    } catch (e) {
        return res.send("Invalid Token");
    }
}

router.get("/secret", authenticateUser, (req, res) => {
    return res.send("I am a secret data only logged in users can access.");
});

// -----------------------------------------------------------------------------
module.exports = router;
