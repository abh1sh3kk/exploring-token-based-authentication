const express = require("express");
const router = express.Router();
// -----------------------------------------------------------------------------

router.get("/secret", (req, res) => {
    res.send("I am a secret data only logged in users can access.");
});

// -----------------------------------------------------------------------------
module.exports = router;
