const mongoose = require("mongoose");
const profileSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phoneNumber: String,
  ID: String,
});
const profile = mongoose.model("profile", profileSchema);
const transactionSchema = new mongoose.Schema({
  userId: String,
  puchaseDate: String,
  tokenPrice: Number,
  amtToken: Number,
  totalPrice: Number,
  point: Number,
  paymentId: String,
});
const transaction = mongoose.model("transaction", transactionSchema);
const walletSchema = new mongoose.Schema({
  userId: String,
  totalPoints: Number,
  totalTokens: Number,
});
const wallet = mongoose.model("wallet", walletSchema);
exports.profile = profile;
exports.transaction = transaction;
exports.wallet = wallet;
