const mongoose = require("mongoose");

const liveJoinedSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
  },
  liveId: {
    type: String,
  }
});

var liveJoinedModel = mongoose.model("live_joined", liveJoinedSchema);
module.exports = liveJoinedModel;