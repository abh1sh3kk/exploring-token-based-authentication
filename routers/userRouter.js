const express = require("express");
const router = express.Router();
const UserModel = require("../models/users");
const bcrypt = require("bcrypt");
// -----------------------------------------------------------------------------
router.use(express.urlencoded({ extended: true }));
router.get("/", (req, res) => {
    res.send("I am a users page");
});

router.post("/signin", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const foundUser = await UserModel.findOne({ email: email });
        if (foundUser === null) {
            return res.send("User Not Found");
        }
        console.log(`Found user is: ${foundUser}`);

        // User exists, now we compare the password
        const isPwCorrect = await bcrypt.compare(password, foundUser.password);
        if (isPwCorrect) {
            return res.send("You are a verified User.");
        }
        return res.send("Sorry the password you entered is incorrect");
    } catch (e) {
        console.log(`There seems to be an error ${e}`);
    }
});

router.post("/signup", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 10);

    

    const userData = {
        email,
        password: hashedPassword,
    };

    try {
        const existingUser = await UserModel.findOne({email: email});
        if (existingUser !== null ) {
            console.log(existingUser);
            return res.send("User Already Exists. Enter a new Email Address.")
        }
        const insertedUser = await UserModel.create(userData);
        console.log(`inserted user is ${insertedUser}`);
        return res.send("User successfully created")
    } catch (e) {
        console.log(`Error detected in inserting the userdata ${e}`);
    }

    // check if user already exists or not
    // receive the credentials
    // hash the password and store it
    // create a jwt token and send it to the client
});

router.get("/signin", (req, res) => {
    res.render("./layouts/signin");
});

router.get("/signup", (req, res) => {
    res.render("./layouts/signup");
});

// -----------------------------------------------------------------------------
module.exports = router;
