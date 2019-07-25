const express = require("express");
const router = express.Router();
const authmw = require("../../middleware/authmw");
const { check, validationResult } = require("express-validator/check");
//const User = require("../Models/UserModel");

const CustPurch = require("../../Models/purchase order/CustPurchModel");

// @route   GET api/cust_purch
// @desc    view Added CustPurch
// @access  Private

router.get("/", authmw, async (req, res) => {
  try {
    const cust_purchs = await CustPurch.find({ user: req.user.id }).sort({
      date: -1
    });

    res.json(cust_purchs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   Post api/CustPurch/
// @desc    add newCustPurch
// @access  Private

router.post(
  "/",
  [
    authmw,
    [
      check("po_no", "Purchase Order No is Required")
        .not()
        .isEmpty(),

      check("quot_no", "Quotation No is Required")
        .not()
        .isEmpty(),

      check("customer", "Customer Name is Required")
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
      quot_no,
      po_no,
      customer,
      ammendment,
      project,
      account,
      delivery,
      payment_term
    } = req.body;
    try {
      const newCustPurch = new CustPurch({
        quot_no,
        po_no,
        customer,
        ammendment,
        project,
        account,
        delivery,
        payment_term,
        user: req.user.id
      });
      const cust_purch = await newCustPurch.save();
      res.json(cust_purch);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   Put api/CustPurch/:id
// @desc    UpdateCustPurch
// @access  Private

router.put("/:id", authmw, async (req, res) => {
  const {
    quot_no,
    po_no,
    customer,
    ammendment,
    project,
    account,
    delivery,
    payment_term
  } = req.body;

  // Build CustPurch Object
  const cust_purchFields = {};
  if (quot_no) cust_purchFields.quot_no = quot_no;
  if (customer) cust_purchFields.customer = customer;
  if (po_no) cust_purchFields.po_no = po_no;
  if (ammendment) cust_purchFields.ammendment = ammendment;
  if (project) cust_purchFields.project = project;
  if (account) cust_purchFields.account = account;
  if (delivery) cust_purchFields.delivery = delivery;
  if (payment_term) cust_purchFields.payment_term = payment_term;

  try {
    let cust_purch = await CustPurch.findById(req.params.id);
    if (!cust_purch)
      return res.status(404).json({ msg: "CustPurch Not Found" });

    // Making sure user owns contact & user doesnt updtae another user contact
    if (cust_purch.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not Authorized" });
    }

    cust_purch = await CustPurch.findByIdAndUpdate(
      req.params.id,
      { $set: cust_purchFields },
      { new: true }
    );
    res.json(cust_purch);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   Delete api/cust_purch/:id
// @desc    Delete Suppler
// @access  Private

router.delete("/:id", authmw, async (req, res) => {
  try {
    let cust_purch = await CustPurch.findById(req.params.id);
    if (!cust_purch)
      return res.status(404).json({ msg: "CustPurch Not Found" });

    // Making sure user owns contact & user doesnt delete another user cust_purch
    if (cust_purch.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not Authorized" });
    }

    await CustPurch.findOneAndRemove(req.params.id);

    res.json({ msg: "CustPurch Deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
