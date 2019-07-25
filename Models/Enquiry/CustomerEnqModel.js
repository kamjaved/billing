const mongoose = require("mongoose");

const CustomerEnqSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  enq_no: {
    type: String
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
module.exports = mongoose.model("customer_enq", CustomerEnqSchema);
