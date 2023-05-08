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
    // check if the user exists in the database
    // check the password
    // create a jwt token
    // send it to the client

    // UserModel.findOne()
    const email = req.body.email;
    const password = req.body.password;


    // try {
    //     const foundUser = await UserModel.find({ email: email });
    //     if (foundUser === null) {
    //         return res.send("I am sorry but the user is not found.");
    //     } else {
    //         console.log(`Found user is  ${foundUser}`);
    //     }
    // } catch (e) {
    //     console.log("Error while finding the user.", e);
    // }

    res.send(`Your email is ${email} and your password is ${password}`);
});

router.post("/signup", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = { email, password: hashedPassword };

    try {
        const insertedUser = await UserModel.create(userData);
        console.log(`inserted user is ${insertedUser}`);
    } catch (e) {
        console.log(`Error detected in inserting the userdata ${e}`);
    }

    // check if user already exists or not
    // receive the credentials
    // hash the password and store it
    // create a jwt token and send it to the client
    res.send(
        "Hi, my existence is merely for the acknowledgement of your post request."
    );
});

router.get("/signin", (req, res) => {
    res.render("./layouts/signin");
});

router.get("/signup", (req, res) => {
    res.render("./layouts/signup");
});

// -----------------------------------------------------------------------------
module.exports = router;
