const express = require("express");
const router = express.Router();
const authmw = require("../../middleware/authmw");
const { check, validationResult } = require("express-validator/check");
//const User = require("../Models/UserModel");
const Invoice = require("../../Models/sales/InvoiceModel");

// @route   GET api/invoice
// @desc    view Added Invoice
// @access  Private
router.get("/", authmw, async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user.id }).sort({
      date: -1
    });

    res.json(invoices);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   Post api/Invoice/
// @desc    add newInvoice
// @access  Private

router.post(
  "/",
  [
    authmw,
    [
      check("dn_no", "Delivery Note No is Required")
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
      invoice_no,
      dn_no,
      customer,
      inv_date,
      freight_amt,
      packaging_amt
    } = req.body;
    try {
      const newInvoice = new Invoice({
        invoice_no,
        dn_no,
        customer,
        inv_date,
        freight_amt,
        packaging_amt,
        user: req.user.id
      });
      const invoice = await newInvoice.save();
      res.json(invoice);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   Put api/Invoice/:id
// @desc    UpdateInvoice
// @access  Private

router.put("/:id", authmw, async (req, res) => {
  const {
    invoice_no,
    dn_no,
    customer,
    inv_date,
    freight_amt,
    packaging_amt
  } = req.body;

  // Build Invoice Object
  const invoiceFields = {};
  if (invoice_no) invoiceFields.invoice_no = invoice_no;
  if (customer) invoiceFields.customer = customer;
  if (dn_no) invoiceFields.dn_no = dn_no;
  if (inv_date) invoiceFields.inv_date = inv_date;
  if (freight_amt) invoiceFields.freight_amt = freight_amt;
  if (packaging_amt) invoiceFields.packaging_amt = packaging_amt;

  try {
    let invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ msg: "Invoice Not Found" });

    // Making sure user owns contact & user doesnt updtae another user contact
    if (invoice.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not Authorized" });
    }

    invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { $set: invoiceFields },
      { new: true }
    );
    res.json(invoice);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   Delete api/invoice/:id
// @desc    Delete Suppler
// @access  Private

router.delete("/:id", authmw, async (req, res) => {
  try {
    let invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ msg: "Invoice Not Found" });

    // Making sure user owns contact & user doesnt delete another user invoice
    if (invoice.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not Authorized" });
    }

    await Invoice.findOneAndRemove(req.params.id);

    res.json({ msg: "Invoice Deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
