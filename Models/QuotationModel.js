const mongoose = require("mongoose");

const QuotationSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  quot_no: {
    type: String
  },

  enq_no: {
    type: String,
    required: true
  },
  customer: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    default: Date.now
  }
});
module.exports = mongoose.model("quotation", QuotationSchema);
