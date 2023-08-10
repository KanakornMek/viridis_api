const express = require("express");
const mongoose = require("mongoose");
const qr = require("qrcode");
const cors = require("cors");
const app = express();
require("dotenv").config();
const verifyToken = require("./src/utils/verifyjwt");
const tokenRouter = require("./src/routers/token");
const userRouter = require("./src/routers/user");
const serviceRouter = require("./src/routers/service");
const createReceiptSlip = require("./src/utils/slipGen/slipGen");
const Transactions = require("./src/models/Transactions");
const User = require("./src/models/User");
app.use(cors())
app.use(express.json());

const port = 4000;
mongoose.connect(process.env.MONGO_URL);
mongoose.connection.on("connected", () => {
  console.log("connected to database");
});


app.use("/service", serviceRouter);
app.get("/slip", async (req, res) => {
  const { slipId } = req.query;
  const transaction = await Transactions.findOne({slipId}).exec();
  if(!transaction) return res.status(404).json({message: "transaction not found"})
  const user = await User.findById(transaction.userId)
  if(!user) return res.status(404).json({message: 'user not found'})
  const name = user.firstname + ' ' + user.lastname;

  const slipBuffer = await createReceiptSlip(slipId, name, transaction.amtToken, transaction.tokenPrice, transaction.totalPrice, transaction.purchaseDate);
  res.set('Content-Type', 'image/png');
  res.send(slipBuffer);
})
app.use(verifyToken);

app.use("/token", tokenRouter);
app.use("/user", userRouter);


app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
