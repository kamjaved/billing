const mongoose = require("mongoose");

const CustPurchSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },

  quot_no: {
    type: String,
    required: true
  },
  po_no: {
    type: String,
    required: true
  },
  po_date: {
    type: Date,
    default: Date.now
  },

  customer: {
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
module.exports = mongoose.model("custpurch", CustPurchSchema);
