const express = require("express");
const router = express.Router();
const authmw = require("../middleware/authmw");
const { check, validationResult } = require("express-validator/check");
const User = require("../Models/UserModel");
const Supplier = require("../Models/SupplierModel");

// @route   GET api/supplier
// @desc    view Added Supplier
// @access  Private
router.get("/", authmw, async (req, res) => {
  try {
    const suppliers = await Supplier.find({ user: req.user.id }).sort({
      date: -1
    });

    res.json(suppliers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   Post api/Supplier/
// @desc    add newSupplier
// @access  Private

router.post(
  "/",
  [
    authmw,
    [
      check("name", "Name is Required")
        .not()
        .isEmpty(),

      check("contact_person", "Person Name is Required")
        .not()
        .isEmpty(),

      check("adress", "Adress is Required")
        .not()
        .isEmpty(),

      check("city", "Enter City")
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
      name,
      cr_no,
      email,
      phone,
      contact_person,
      adress,
      city
    } = req.body;
    try {
      const newSupplier = new Supplier({
        name,
        cr_no,
        email,
        phone,
        contact_person,
        adress,
        city,
        user: req.user.id
      });
      const supplier = await newSupplier.save();
      res.json(supplier);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   Put api/Supplier/:id
// @desc    UpdateSupplier
// @access  Private

router.put("/:id", authmw, async (req, res) => {
  const { name, cr_no, email, phone, contact_person, adress, city } = req.body;

  // Build Supplier Object
  const supplierFields = {};
  if (name) supplierFields.name = name;
  if (cr_no) supplierFields.cr_no = cr_no;
  if (email) supplierFields.email = email;
  if (phone) supplierFields.phone = phone;
  if (city) supplierFields.city = city;
  if (adress) supplierFields.adress = adress;
  if (contact_person) supplierFields.contact_person = contact_person;

  try {
    let supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ msg: "Supplier Not Found" });

    // Making sure user owns supplier & user doesnt updtae another user supplier
    if (supplier.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not Authorized" });
    }

    supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      { $set: supplierFields },
      { new: true }
    );
    res.json(supplier);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   Delete api/supplier/:id
// @desc    Delete Suppler
// @access  Private

router.delete("/:id", authmw, async (req, res) => {
  try {
    let supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ msg: "Supplier Not Found" });

    // Making sure user owns supplier & user doesnt delete another user supplier
    if (supplier.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not Authorized" });
    }

    await Supplier.findOneAndRemove(req.params.id);

    res.json({ msg: "Supplier Deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
