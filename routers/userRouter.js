const express = require("express");
const router = express.Router();
const UserModel = require("../models/users");
const userTokens = require("../models/userTokens");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { generateJwtToken } = require("../src/utils/utils");
// -----------------------------------------------------------------------------
router.use(express.urlencoded({ extended: true }));
router.get("/", (req, res) => {
    res.send("I am a users page");
});

router
    .route("/signin")
    .post(async (req, res) => {
        const { email, password } = req.body;

        try {
            // -----------------------------------------------------------------------------
            const foundUser = await UserModel.findOne({ email: email });
            if (foundUser === null) {
                return res.send("User Not Found");
            }
            // -----------------------------------------------------------------------------

            // -----------------------------------------------------------------------------
            const isPwCorrect = await bcrypt.compare(
                password,
                foundUser.password
            );
            if (!isPwCorrect) {
                return res.send("Sorry the password you entered is incorrect");
            }
            // -----------------------------------------------------------------------------

            const access_token = generateJwtToken(
                {
                    id: foundUser._id,
                    refreshCount: 1,
                },
                process.env.ACCESS_TOKEN_TIME
            );
            const refresh_token = generateJwtToken(
                process.env.REFRESH_TOKEN_KEY,
                process.env.REFRESH_TOKEN_TIME
            );
            const jwtToken = {
                status: "Logged In",
                access_token: access_token,
                refresh_token: refresh_token,
            };

            // -----------------------------------------------------------------------------
            const jwtForDB = {
                userId: foundUser._id,
                access_token: access_token,
                refresh_token: refresh_token,
            };
            const updatedDocument = await userTokens.findOneAndUpdate(
                { userId: foundUser._id },
                jwtForDB,
                { upsert: true, new: true }
            );
            console.log(`Updated Document is `, updatedDocument);
            // -----------------------------------------------------------------------------

            return res.cookie("jwt", jwtToken).send("You are a verified User.");

            // -----------------------------------------------------------------------------
        } catch (e) {
            console.log(`There seems to be an error ${e}`);
        }
    })
    .get((req, res) => {
        res.render("./layouts/signin");
    });

router
    .route("/signup")
    .post(async (req, res) => {
        const { email, password } = req.body;
        // -----------------------------------------------------------------------------

        try {
            // -----------------------------------------------------------------------------
            const existingUser = await UserModel.findOne({ email: email });
            if (existingUser !== null) {
                return res.send(
                    "User Already Exists. Enter a new Email Address."
                );
            }
            // -----------------------------------------------------------------------------

            const hashedPassword = await bcrypt.hash(password, 10);
            const userData = {
                email,
                password: hashedPassword,
            };
            const insertedUser = await UserModel.create(userData);

            // -----------------------------------------------------------------------------

            const access_token = generateJwtToken({
                id: insertedUser._id,
                refreshCount: 1,
            });
            const refresh_token = generateJwtToken(
                process.env.REFRESH_TOKEN_KEY
            );
            const jwtToken = {
                status: "Logged In",
                refresh_token: refresh_token,
                access_token: access_token,
            };
            // -----------------------------------------------------------------------------
            const jwtForDB = {
                userId: insertedUser._id,
                access_token: access_token,
                refresh_token: refresh_token,
            };
            await userTokens.create(jwtForDB);
            // -----------------------------------------------------------------------------

            return res
                .cookie("jwt", jwtToken)
                .send("User Successfully Created.");
        } catch (e) {
            console.log(`Error detected in inserting the userdata ${e}`);
        }
        // -----------------------------------------------------------------------------
    })
    .get((req, res) => {
        res.render("./layouts/signup");
    });

// -----------------------------------------------------------------------------
module.exports = router;
