const mongoose = require("mongoose");

const ItemSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  desc: {
    type: String,
    required: true
  },

  item_no: {
    type: String
  },
  code_partno: {
    type: String
  },
  supplier: {
    type: String,
    required: true
  },
  purchase_price: {
    type: String,
    required: true
  },
  sell_price: {
    type: String,
    required: true
  }
});
module.exports = mongoose.model("item", ItemSchema);
