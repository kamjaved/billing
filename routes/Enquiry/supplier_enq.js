const express = require("express");
const router = express.Router();
const authmw = require("../../middleware/authmw");
const { check, validationResult } = require("express-validator/check");
const User = require("../../Models/UserModel");
const Supplier_enq = require("../../Models/Enquiry/SupplierEnqModel");

// @route   GET api/supplier_enq
// @desc    view Added Supplier_enq
// @access  Private
router.get("/", authmw, async (req, res) => {
  try {
    const supplier_enqs = await Supplier_enq.find({ user: req.user.id }).sort({
      date: -1
    });

    res.json(supplier_enqs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   Post api/Supplier_enq/
// @desc    add newSupplier_enq
// @access  Private

router.post(
  "/",
  [
    authmw,
    [
      check("supplier", "Supplier is Required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { enq_no, supplier } = req.body;
    try {
      const newSupplier_enq = new Supplier_enq({
        enq_no,
        supplier,
        user: req.user.id
      });
      const supplier_enq = await newSupplier_enq.save();
      res.json(supplier_enq);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   Put api/Supplier_enq/:id
// @desc    UpdateSupplier_enq
// @access  Private

router.put("/:id", authmw, async (req, res) => {
  const { enq_no, supplier } = req.body;

  // Build Supplier_enq Object
  const supplier_enqFields = {};
  if (enq_no) supplier_enqFields.enq_no = enq_no;
  if (supplier) supplier_enqFields.supplier = supplier;

  try {
    let supplier_enq = await Supplier_enq.findById(req.params.id);
    if (!supplier_enq)
      return res.status(404).json({ msg: "Supplier_enq Not Found" });

    // Making sure user owns Supplier_enqs & user doesnt updtae another user Supplier_enqs
    if (supplier_enq.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not Authorized" });
    }

    supplier_enq = await Supplier_enq.findByIdAndUpdate(
      req.params.id,
      { $set: supplier_enqFields },
      { new: true }
    );
    res.json(supplier_enq);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   Delete api/supplier_enq/:id
// @desc    Delete Suppler
// @access  Private

router.delete("/:id", authmw, async (req, res) => {
  try {
    let supplier_enq = await Supplier_enq.findById(req.params.id);
    if (!supplier_enq)
      return res.status(404).json({ msg: "Supplier_enq Not Found" });

    // Making sure user owns supplier_enq & user doesnt delete another user supplier_enq
    if (supplier_enq.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not Authorized" });
    }

    await Supplier_enq.findOneAndRemove(req.params.id);

    res.json({ msg: "Supplier_enq Deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
