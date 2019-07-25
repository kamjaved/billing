const mongoose = require("mongoose");

const GRNSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },

  grn_no: {
    type: String
  },

  po_no: {
    type: String,
    required: true
  },
  supplier_invoice_no: {
    type: String,
    required: true
  },

  grn_date: {
    type: Date,
    default: Date.now
  }
});
module.exports = mongoose.model("grn", GRNSchema);
