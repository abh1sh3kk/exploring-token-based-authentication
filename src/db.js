const mongoose = require("mongoose");

(async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/userCredentials");
        console.log("Connection established");
    } catch (e) {
        console.log(`Connection failed ${e}`);
    }
})();
