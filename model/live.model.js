const mongoose = require("mongoose");

const liveSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
  },
  joinedUsers: [{ type: [mongoose.Types.ObjectId] }],
  waitingUsers: [{ type: [mongoose.Types.ObjectId] }],
  liveCode: {
    type: String,
  },
  isEnded: {
    type: Boolean,
  },
});

var liveModel = mongoose.model("Lives", liveSchema);
module.exports = liveModel;
