const express = require("express");
const router = express.Router();
const authmw = require("../middleware/authmw");
const { check, validationResult } = require("express-validator/check");
const User = require("../Models/UserModel");
const Expense = require("../Models/ExpensesModel");

// @route   GET api/expense
// @desc    view Added Expense
// @access  Private
router.get("/", authmw, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({
      date: -1
    });

    res.json(expenses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   Post api/Expense/
// @desc    add newExpense
// @access  Private

router.post(
  "/",
  [
    authmw,
    [
      check("name", "Name is Required")
        .not()
        .isEmpty(),

      check("category", "Please Select a Category")
        .not()
        .isEmpty(),

      check("payment_method", "Select Payment Method")
        .not()
        .isEmpty(),

      check("amount", "Enter Amount")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      voucher_no,
      name,
      category,
      desc,
      payment_method,
      cheque_no,
      amount,
      exp_date
    } = req.body;
    try {
      const newExpense = new Expense({
        voucher_no,
        name,
        category,
        desc,
        payment_method,
        cheque_no,
        amount,
        exp_date,
        user: req.user.id
      });
      const expense = await newExpense.save();
      res.json(expense);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   Put api/Expense/:id
// @desc    UpdateExpense
// @access  Private

router.put("/:id", authmw, async (req, res) => {
  const {
    voucher_no,
    name,
    category,
    desc,
    payment_method,
    cheque_no,
    amount,
    exp_date
  } = req.body;

  // Build Expense Object
  const expenseFields = {};
  if (name) expenseFields.name = name;
  if (voucher_no) expenseFields.voucher_no = voucher_no;
  if (category) expenseFields.category = category;
  if (desc) expenseFields.desc = desc;
  if (payment_method) expenseFields.payment_method = payment_method;
  if (cheque_no) expenseFields.cheque_no = cheque_no;
  if (amount) expenseFields.amount = amount;
  if (exp_date) expenseFields.exp_date = exp_date;

  try {
    let expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ msg: "Expense Not Found" });

    // Making sure user owns contact & user doesnt updtae another user contact
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not Authorized" });
    }

    expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { $set: expenseFields },
      { new: true }
    );
    res.json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   Delete api/expense/:id
// @desc    Delete Suppler
// @access  Private

router.delete("/:id", authmw, async (req, res) => {
  try {
    let expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ msg: "Expense Not Found" });

    // Making sure user owns contact & user doesnt delete another user expense
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not Authorized" });
    }

    await Expense.findOneAndRemove(req.params.id);

    res.json({ msg: "Expense Deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
