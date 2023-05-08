const express = require("express");
const router = express.Router();
// -----------------------------------------------------------------------------

router.get("/", (req, res) => {
	res.send("I am a users page");
})

router.get("/login", (req, res) => {
    res.send("I am a login page");
});

router.get("/signup", (req, res) => {
    res.send("I am a signup page");
});

// -----------------------------------------------------------------------------
module.exports = router;