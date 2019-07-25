const express = require("express");
const router = express.Router();
const authmw = require("../middleware/authmw");
const { check, validationResult } = require("express-validator/check");
const User = require("../Models/UserModel");
const Grn = require("../Models/GrnModel");

// @route   GET api/GRN
// @desc    view Added Grn
// @access  Private
router.get("/", authmw, async (req, res) => {
  try {
    const GRN = await Grn.find({ user: req.user.id }).sort({
      date: -1
    });

    res.json(GRN);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   Post api/Grn/
// @desc    add newGrn
// @access  Private

router.post(
  "/",
  [
    authmw,
    [
      check("po_no", "Enquiry No is Required")
        .not()
        .isEmpty(),

      check("supplier_invoice_no", "Supplier Invoice No. is Required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { supplier_invoice_no, po_no, grn_no, grn_date } = req.body;
    try {
      const newGrn = new Grn({
        supplier_invoice_no,
        po_no,
        grn_no,
        grn_date,
        user: req.user.id
      });
      const GRN = await newGrn.save();
      res.json(GRN);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   Put api/Grn/:id
// @desc    UpdateGrn
// @access  Private

router.put("/:id", authmw, async (req, res) => {
  const { supplier_invoice_no, po_no, grn_no, grn_date } = req.body;

  // Build Grn Object
  const GRNFields = {};
  if (supplier_invoice_no) GRNFields.supplier_invoice_no = supplier_invoice_no;
  if (po_no) GRNFields.po_no = po_no;
  if (grn_no) GRNFields.grn_no = grn_no;
  if (grn_date) GRNFields.grn_date = grn_date;

  try {
    let GRN = await Grn.findById(req.params.id);
    if (!GRN) return res.status(404).json({ msg: "Grn Not Found" });

    // Making sure user owns contact & user doesnt updtae another user contact
    if (GRN.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not Authorized" });
    }

    GRN = await Grn.findByIdAndUpdate(
      req.params.id,
      { $set: GRNFields },
      { new: true }
    );
    res.json(GRN);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   Delete api/GRN/:id
// @desc    Delete Suppler
// @access  Private

router.delete("/:id", authmw, async (req, res) => {
  try {
    let GRN = await Grn.findById(req.params.id);
    if (!GRN) return res.status(404).json({ msg: "Grn Not Found" });

    // Making sure user owns contact & user doesnt delete another user GRN
    if (GRN.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not Authorized" });
    }

    await Grn.findOneAndRemove(req.params.id);

    res.json({ msg: "Grn Deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
