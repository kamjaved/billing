const mongoose = require("mongoose");

const SuppPurchSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },

  po_no: {
    type: String,
    required: true
  },
  po_date: {
    type: Date,
    default: Date.now
  },
  customer_refrence: {
    type: String
  },
  customer: {
    type: String
  },
  supplier: {
    type: String,
    required: true
  },
  ammendment: {
    type: String
  },

  project: {
    type: String
  },
  account: {
    type: String
  },
  delivery: {
    type: String
  },
  payment_term: {
    type: String
  }
});
module.exports = mongoose.model("supplpurch", SuppPurchSchema);
