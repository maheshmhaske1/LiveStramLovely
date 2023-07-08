const mongoose = require("mongoose");

const userCoinHistorySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
        },
        sendedCoin: {
            type: Number
        }
    },
    {
        timestamps: true,
    });

var userCoinHistoryModel = mongoose.model("userCoinHistory", userCoinHistorySchema);
module.exports = userCoinHistoryModel;
