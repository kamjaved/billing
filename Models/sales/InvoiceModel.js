const mongoose = require("mongoose");

const InvoiceSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  invoice_no: {
    type: String
  },

  dn_no: {
    type: String,
    required: true
  },
  customer: {
    type: String,
    required: true
  },

  inv_date: {
    type: Date,
    default: Date.now
  },
  freight_amt: {
    type: String
  },
  packaging_amt: {
    type: String
  }
});
module.exports = mongoose.model("invoice", InvoiceSchema);
