const mongoose = require("mongoose");
mongoose
  .connect("mongodb+srv://admin:admin@cluster0.rzrys1f.mongodb.net/")
  .then(() => console.log("connection successful"))
  .catch((err) => {
    console.log("error description: " + err);
    process.exit();
  });
