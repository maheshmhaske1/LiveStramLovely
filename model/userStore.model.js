const mongoose = require("mongoose");

const userStoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
  },
  storeId: {
    type: mongoose.Types.ObjectId,
  },
  validTill: {
    type: Date,
  },
});

var userStoreModel = mongoose.model("userStoreItems", userStoreSchema);
module.exports = userStoreModel;
