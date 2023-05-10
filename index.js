const express = require("express");
const app = express();
const userRouter = require("./routers/userRouter");
const dataRouter = require("./routers/dataRouter");
require("./controllers/db");
const cookieParser = require("cookie-parser");
const { generateJwtToken } = require("./src/utils/utils");
const jwt = require("jsonwebtoken");
const userTokens = require("./models/userTokens");
// -----------------------------------------------------------------------------
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use("/users", userRouter);
app.use("/data", dataRouter);
// -----------------------------------------------------------------------------

app.get("/", (req, res) => {
    res.render("./layouts/homepage");
});

app.get("/refresh", (req, res) => {
    const cookiess = req.cookies && req.cookies.jwt;

    // -----------------------------------------------------------------------------
    if (!cookiess) return res.send("Sorry you don't have any cookies");
    if (!cookiess.refresh_token)
        return res.send("sorry you don't have refresh token");
    // -----------------------------------------------------------------------------

    const { refresh_token, access_token } = cookiess;

    // -----------------------------------------------------------------------------
    // change the payload to generate unique access_token each time it refreshes
    // -----------------------------------------------------------------------------
    const decodedToken = jwt.decode(access_token);
    decodedToken.refreshCount++;
    const newAccessToken = generateJwtToken(
        decodedToken,
        process.env.ACCESS_TOKEN_TIME
    );
    // -----------------------------------------------------------------------------

    const jwtForDB = {
        userId: decodedToken.id,
        access_token: newAccessToken,
        refresh_token: refresh_token,
    };

    userTokens.findOneAndUpdate({ userId: decodedToken.id }, jwtForDB, {
        upsert: true,
        new: true,
    });

    // -----------------------------------------------------------------------------

    const newCookie = {
        status: "Logged In",
        access_token: newAccessToken,
        refresh_token: refresh_token,
    };

    const textToRender = `<h1>Access Token Updated:</h1> 
    <b>Before:</b> <pre>${access_token}</pre>


    <b>After:</b> <pre>${newAccessToken}</pre>
    
    
    <h3>Trust me they are different</h3>
    `

    return res.cookie("jwt", newCookie).send(textToRender);
});

app.get("/validate", (req, res) => {
    const cookiess = req.cookies && req.cookies.jwt;
    console.log(`cookies to validate`, cookiess);

    res.send(cookiess);
});

// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
const PORT = 4000;
app.listen(PORT, (req, res) => console.log("Server is listening at ", PORT));
