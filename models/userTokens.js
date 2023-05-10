const mongoose = require("mongoose");

const userTokenSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    refresh_token: {
        type: String,
        required: true,
    },
    access_token: {
        type: String,
    },
});

const userTokens = mongoose.model("User Authentication Tokens", userTokenSchema);

module.exports = userTokens;
