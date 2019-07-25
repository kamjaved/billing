const mongoose = require("mongoose");

const ExpensesSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  voucher_no: {
    type: String
  },
  name: {
    type: String,
    required: true
  },

  category: {
    type: String,
    required: true
  },
  desc: {
    type: String
  },

  payment_method: {
    type: String,
    required: true
  },
  cheque_no: {
    type: String
  },
  amount: {
    type: String,
    required: true
  },

  exp_date: {
    type: Date,
    default: Date.now
  }
});
module.exports = mongoose.model("expenses", ExpensesSchema);
