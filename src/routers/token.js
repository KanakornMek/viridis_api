const express = require("express");
const mongoose = require("mongoose");
const qs = require("querystring");
const router = express.Router();
const User = require("../models/User");
const Token = require("../models/Token");
const Transactions = require("../models/Transactions");

router.get("/purchase", async (req, res) => {
  let { amtToken, tokenPrice, sourceId } = req.body;
  if (!req.body.amtToken) return res.status(400).send();
  amtToken = parseInt(amtToken);
  tokenPrice = parseInt(tokenPrice);
  const totalPrice = amtToken * tokenPrice;

  const result = await axios.post(
    "https://api.omise.co/charges",
    qs.stringify({
      amount: totalPrice * 100,
      currency: "THB",
      source: sourceId,
      return_uri: "http://localhost:5173/",
    }),
    {
      auth: {
        username: "skey_test_5ok93p8pzji7lri71n9",
      },
    }
  );
  const newPurchase = new Transactions({
    purchaseDate: new Date.now(),
    tokenPrice,
    amtToken,
    totalPrice,
    point: totalPrice,
    status: "pending",
    userId: req.user.userId,
    paymentId: result.data.id,
  });

  await newPurchase.save();
  if (type === "promptpay") {
    res.json({ qr_code: result.data.source.scannable_code.image.download_uri });
  } else {
    res.json({ authorize_uri: result.data.authorize_uri });
  }
});

router.get("/price", async (req, res) => {
  const token = await Token.findOne();
  console.log(token);
  res.json(token);
});

module.exports = router;
