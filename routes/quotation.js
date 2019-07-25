const express = require("express");
const router = express.Router();
const authmw = require("../middleware/authmw");
const { check, validationResult } = require("express-validator/check");
const User = require("../Models/UserModel");
const Quotation = require("../Models/QuotationModel");

// @route   GET api/quotation
// @desc    view Added Quotation
// @access  Private
router.get("/", authmw, async (req, res) => {
  try {
    const quotations = await Quotation.find({ user: req.user.id }).sort({
      date: -1
    });

    res.json(quotations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   Post api/Quotation/
// @desc    add newQuotation
// @access  Private

router.post(
  "/",
  [
    authmw,
    [
      check("enq_no", "Enquiry No is Required")
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

    const { quot_no, enq_no, customer } = req.body;
    try {
      const newQuotation = new Quotation({
        quot_no,
        enq_no,
        customer,
        user: req.user.id
      });
      const quotation = await newQuotation.save();
      res.json(quotation);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   Put api/Quotation/:id
// @desc    UpdateQuotation
// @access  Private

router.put("/:id", authmw, async (req, res) => {
  const { quot_no, enq_no, customer } = req.body;

  // Build Quotation Object
  const quotationFields = {};
  if (quot_no) quotationFields.quot_no = quot_no;
  if (customer) quotationFields.customer = customer;
  if (enq_no) quotationFields.enq_no = enq_no;

  try {
    let quotation = await Quotation.findById(req.params.id);
    if (!quotation) return res.status(404).json({ msg: "Quotation Not Found" });

    // Making sure user owns contact & user doesnt updtae another user contact
    if (quotation.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not Authorized" });
    }

    quotation = await Quotation.findByIdAndUpdate(
      req.params.id,
      { $set: quotationFields },
      { new: true }
    );
    res.json(quotation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   Delete api/quotation/:id
// @desc    Delete Suppler
// @access  Private

router.delete("/:id", authmw, async (req, res) => {
  try {
    let quotation = await Quotation.findById(req.params.id);
    if (!quotation) return res.status(404).json({ msg: "Quotation Not Found" });

    // Making sure user owns contact & user doesnt delete another user quotation
    if (quotation.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not Authorized" });
    }

    await Quotation.findOneAndRemove(req.params.id);

    res.json({ msg: "Quotation Deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
