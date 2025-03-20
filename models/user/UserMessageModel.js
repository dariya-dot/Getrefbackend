const mongoose = require("mongoose");

const userMessageSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User"}, 
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

const UserMessageModel = mongoose.model("UserMessage", userMessageSchema);
module.exports = UserMessageModel;
