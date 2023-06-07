const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
  price: {
    type: Number
  },
  validity: {
    type: Number
  },
  name: {
    type: String,
    default: "",
  },
  storeUrl: {
    type: String,
  },
});

var storeModel = mongoose.model("storeItems", storeSchema);
module.exports = storeModel;
