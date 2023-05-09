const express = require("express");
const router = express.Router();
const UserModel = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// -----------------------------------------------------------------------------
router.use(express.urlencoded({ extended: true }));
router.get("/", (req, res) => {
    res.send("I am a users page");
});

function generateJwtToken(userId) {
    return jwt.sign({ userId }, "key key do you love me");
}

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    try {
        // -----------------------------------------------------------------------------
        const foundUser = await UserModel.findOne({ email: email });
        if (foundUser === null) {
            return res.send("User Not Found");
        }
        // -----------------------------------------------------------------------------

        // -----------------------------------------------------------------------------
        const isPwCorrect = await bcrypt.compare(password, foundUser.password);
        if (!isPwCorrect) {
            return res.send("Sorry the password you entered is incorrect");
        }
        const jwtToken = generateJwtToken(foundUser._id);
        return res.cookie("jwt", jwtToken).send("You are a verified User.");
        // -----------------------------------------------------------------------------
    } catch (e) {
        console.log(`There seems to be an error ${e}`);
    }
});

router.post("/signup", async (req, res) => {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
        email,
        password: hashedPassword,
    };

    try {
        const existingUser = await UserModel.findOne({ email: email });
        if (existingUser !== null) {
            console.log(existingUser);
            return res.send("User Already Exists. Enter a new Email Address.");
        }
        const insertedUser = await UserModel.create(userData);
        console.log(`inserted user is ${insertedUser}`);
        const jwtToken = jwt.sign(
            { userId: insertedUser._id },
            "key key do you love me"
        );
        console.log(`JWT Token is ${jwtToken}`);
        return res.send("User successfully created");
    } catch (e) {
        console.log(`Error detected in inserting the userdata ${e}`);
    }
});

router.get("/signin", (req, res) => {
    res.render("./layouts/signin");
});

router.get("/signup", (req, res) => {
    res.render("./layouts/signup");
});

// -----------------------------------------------------------------------------
module.exports = router;
