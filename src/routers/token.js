const express = require("express");
const axios = require("axios")
const qs = require("querystring");
const router = express.Router();
const User = require("../models/User");
const Token = require("../models/Token");
const Transactions = require("../models/Transactions");
const Wallet = require("../models/Wallet");
const { nanoid } = require("nanoid");
require('dotenv').config()
let baseURL
if (process.env.NODE_ENV === "development"){
  baseURL = 'http://localhost:5173'
} else {
  baseURL = 'http://35.187.244.241'
}

router.post("/purchase", async (req, res) => {
  try {
    let { amtToken, tokenPrice, totalPrice, sourceId, type } = req.body;
    const userId = req.user.userId;
    if (!req.body.amtToken) return res.status(400).send();
    amtToken = parseInt(amtToken);
    tokenPrice = parseInt(tokenPrice);
    totalPrice = parseInt(totalPrice);
    const slipId = nanoid(10);
    const result = await axios.post(
      "https://api.omise.co/charges",
      qs.stringify({
        amount: totalPrice * 100,
        currency: "THB",
        source: sourceId,
        return_uri: `${baseURL}/slip?slipId=${slipId}`
      }),
      {
        auth: {
          username: "skey_test_5ok93p8pzji7lri71n9",
        },
      }
    );
    
    const newPurchase = new Transactions({
      purchaseDate: new Date(),
      tokenPrice,
      amtToken,
      totalPrice,
      point: totalPrice,
      status: "pending",
      userId,
      paymentId: result.data.id,
      slipId,
    });

    await newPurchase.save();

    const wallet = await Wallet.findOne({userId}).exec();
    wallet.totalTokens += amtToken;
    wallet.totalPoints += amtToken;

    await wallet.save()
    console.log(result)
    if (type === "promptpay") {
      res.json({ qr_code: result.data.source.scannable_code.image.download_uri });
    } else {
      res.json({ authorize_uri: result.data.authorize_uri });
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500)
  }

});

router.get("/price", async (req, res) => {
  const token = await Token.findOne();
  console.log(token);
  res.json(token);
});

module.exports = router;
