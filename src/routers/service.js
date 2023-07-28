const express = require("express");
const router = express.Router();
const User = require("../models/User");
const wallet = require("../models/Wallet");
const verifyToken = require("../utils/verifyjwt");
const qr =require("qrcode")

router.post("/purchase", async (req, res) => {
    console.log(req.path)

    let { amtToken, tokenPrice, phoneNumber, sourceId } = req.body;
    if (!req.body.amtToken) return res.status(400).send();
    amtToken = parseInt(amtToken);
    tokenPrice = parseInt(tokenPrice);
    const totalPrice = amtToken * tokenPrice;
    const user = User.findOne({phoneNumber})
    if(!user) return res.status(404).json({message: "user not found"});

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
        userId: user._id,
        paymentId: result.data.id,
    });
    const updateWallet = await wallet.findOne({userId:user._id}).exec();
    updateWallet.totalPoints += totalPrice;
    updateWallet.totalTokens += amtToken;
    await updateWallet.save()
    await newPurchase.save();

    if (type === "promptpay") {
        res.json({ qr_code: result.data.source.scannable_code.image.download_uri });
    } else {
        res.json({ authorize_uri: result.data.authorize_uri });
    }
})

router.post("/generateQR" , async (req, res) => {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'user not found' });
    if (!user.serviceAcc) return res.status(400).json({ message: 'not a service Account' })
    const generatedQR = await qr.toDataURL(`http://localhost:5173/qr?serviceId=${user.serviceId}`);
    res.json({ qrData: generatedQR })
})

module.exports = router;