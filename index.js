const express = require("express");
const app = express();
const userRouter = require("./routers/userRouter");
const dataRouter = require("./routers/dataRouter");
require("./controllers/db");
// -----------------------------------------------------------------------------
app.use("/users", userRouter);
app.use("/data", dataRouter);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
// -----------------------------------------------------------------------------

app.get("/", (req, res) => {
    res.render("./layouts/homepage");
});

// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
const PORT = 4000;
app.listen(PORT, (req, res) => console.log("Server is listening at ", PORT));
