const express = require("express");
const app = express();
const userRouter = require("./routers/userRouter");
const dataRouter = require("./routers/dataRouter");
// -----------------------------------------------------------------------------
app.use("/users", userRouter);
app.use('/data', dataRouter);
// -----------------------------------------------------------------------------

app.get("/", (req, res) => {
    res.send("hi");
});

// -----------------------------------------------------------------------------



// -----------------------------------------------------------------------------
const PORT = 3000;
app.listen(PORT, (req, res) => console.log("Server is listening at ", PORT));
