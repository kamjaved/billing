const express = require("express");
connectDB = require("./config/db");
const app = express();

// Connect DataBase
connectDB();

//Init Middleware (BodyParser)
app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.json({ msg: "Hello World" }));

//Define Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/staffs", require("./routes/staff"));
app.use("/api/customers", require("./routes/customer"));
app.use("/api/supplier", require("./routes/supplier"));
app.use("/api/items", require("./routes/items"));

app.use("/api/enquiry-customer", require("./routes/Enquiry/customer_enq"));
app.use("/api/enquiry-supplier", require("./routes/Enquiry/supplier_enq"));

app.use("/api/quotation", require("./routes/quotation"));

app.use("/api/purchase-customer", require("./routes/purchase order/cust_po"));
app.use("/api/purchase-supplier", require("./routes/purchase order/supp_po"));

app.use("/api/grn", require("./routes/grn"));

app.use("/api/sales", require("./routes/sales/deliverynote"));
app.use("/api/invoices", require("./routes/sales/invoice"));

app.use("/api/expenses", require("./routes/expenses"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
