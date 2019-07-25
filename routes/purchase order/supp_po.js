const express = require("express");
const router = express.Router();
const authmw = require("../../middleware/authmw");
const { check, validationResult } = require("express-validator/check");
//const User = require("../Models/UserModel");

const SuppPurch = require("../../Models/purchase order/SuppPurchModel");

// @route   GET api/supp_purch
// @desc    view Added SuppPurch
// @access  Private

router.get("/", authmw, async (req, res) => {
  try {
    const supp_purchs = await SuppPurch.find({ user: req.user.id }).sort({
      date: -1
    });

    res.json(supp_purchs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   Post api/SuppPurch/
// @desc    add newSuppPurch
// @access  Private

router.post(
  "/",
  [
    authmw,
    [
      check("po_no", "Purchase Order No is Required")
        .not()
        .isEmpty(),

      check("supplier", "Supplier Name is Required")
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
      po_no,
      customer,
      supplier,
      ammendment,
      project,
      account,
      delivery,
      payment_term
    } = req.body;
    try {
      const newSuppPurch = new SuppPurch({
        po_no,
        customer,
        supplier,
        ammendment,
        project,
        account,
        delivery,
        payment_term,
        user: req.user.id
      });
      const supp_purch = await newSuppPurch.save();
      res.json(supp_purch);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   Put api/SuppPurch/:id
// @desc    UpdateSuppPurch
// @access  Private

router.put("/:id", authmw, async (req, res) => {
  const {
    po_no,
    customer,
    supplier,
    ammendment,
    project,
    account,
    delivery,
    payment_term
  } = req.body;

  // Build SuppPurch Object
  const supp_purchFields = {};
  if (customer) supp_purchFields.customer = customer;
  if (supplier) supp_purchFields.supplier = supplier;
  if (po_no) supp_purchFields.po_no = po_no;
  if (ammendment) supp_purchFields.ammendment = ammendment;
  if (project) supp_purchFields.project = project;
  if (account) supp_purchFields.account = account;
  if (delivery) supp_purchFields.delivery = delivery;
  if (payment_term) supp_purchFields.payment_term = payment_term;

  try {
    let supp_purch = await SuppPurch.findById(req.params.id);
    if (!supp_purch)
      return res.status(404).json({ msg: "SuppPurch Not Found" });

    // Making sure user owns contact & user doesnt updtae another user contact
    if (supp_purch.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not Authorized" });
    }

    supp_purch = await SuppPurch.findByIdAndUpdate(
      req.params.id,
      { $set: supp_purchFields },
      { new: true }
    );
    res.json(supp_purch);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   Delete api/supp_purch/:id
// @desc    Delete Suppler
// @access  Private

router.delete("/:id", authmw, async (req, res) => {
  try {
    let supp_purch = await SuppPurch.findById(req.params.id);
    if (!supp_purch)
      return res.status(404).json({ msg: "SuppPurch Not Found" });

    // Making sure user owns contact & user doesnt delete another user supp_purch
    if (supp_purch.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not Authorized" });
    }

    await SuppPurch.findOneAndRemove(req.params.id);

    res.json({ msg: "SuppPurch Deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
