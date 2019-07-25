const mongoose = require("mongoose");

const DeliverySchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },

  dn_no: {
    type: String,
    required: true
  },
  po_no: {
    type: String,
    required: true
  },
  dn_date: {
    type: Date,
    default: Date.now
  },

  customer: {
    type: String,
    required: true
  },
  dispatch_through: {
    type: String
  },
  destintion: {
    type: String
  },

  payment_term: {
    type: String
  }
});
module.exports = mongoose.model("delivery", DeliverySchema);
