const mongoose = require("mongoose");

const SupplierEnqSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  enq_no: {
    type: String
  },
  supplier: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    default: Date.now
  }
});
module.exports = mongoose.model("supplier_enq", SupplierEnqSchema);
