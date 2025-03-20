const mongoose = require("mongoose");

const refMessageSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User"}, 
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

const ReferelMessageModel = mongoose.model("ReferelMessageModel", refMessageSchema);
module.exports = ReferelMessageModel;
