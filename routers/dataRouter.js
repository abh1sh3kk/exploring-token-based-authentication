const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
// -----------------------------------------------------------------------------

router.get("/secret", (req, res) => {
    const userjwt = req.cookies.jwt;
    if (userjwt) {
        const jwtValid = jwt.verify(userjwt, "key key do you love me");
        if (jwtValid) {
            return res.send(
                "I am a secret data only logged in users can access."
            );
        }
    }
    res.send("Sorry you are not an authorized user");
});

// -----------------------------------------------------------------------------
module.exports = router;
