const express = require("express");
const axios = require("axios");
const {nanoid} =require("nanoid");
const qs = require("querystring")
const router = express.Router();
const User = require("../models/User");
const wallet = require("../models/Wallet");
const verifyToken = require("../utils/verifyjwt");
const qr = require("qrcode");
const ServiceAcc = require("../models/ServiceAcc");
const Transactions = require("../models/Transactions");
const serviceTrans = require("../models/serviceTrans");
require('dotenv').config();
let baseURL;
if (process.env.NODE_ENV === "development"){
    baseURL = 'http://localhost:5173'
} else {
    baseURL = 'http://viridis.bizineer.com'
}

router.post("/purchase", async (req, res) => {
    let { amtToken, tokenPrice, totalPrice , phoneNumber, sourceId, type, serviceId } = req.body;
    if (!req.body.amtToken) return res.status(400).send();
    amtToken = parseInt(amtToken);
    tokenPrice = parseFloat(tokenPrice);
    totalPrice = parseFloat(totalPrice);
    const user = await User.findOne({ phoneNumber }).exec();
    if (!user) return res.status(404).json({ message: "user not found" });
    const slipId = nanoid(10);
    const result = await axios.post(
        "https://api.omise.co/charges",
        qs.stringify({
            amount: totalPrice * 100,
            currency: "THB",
            source: sourceId,
            return_uri: `${baseURL}/slip?slipId=${slipId}`,
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
        userId: user._id,
        paymentId: result.data.id,
        slipId,
    });
    const updateWallet = await wallet.findOne({ userId: user._id }).exec();
    updateWallet.totalPoints += totalPrice;
    updateWallet.totalTokens += amtToken;
    await updateWallet.save();
    await newPurchase.save();
    const newServiceTrans = new serviceTrans({
        serviceId,
        amtToken
    })

    await newServiceTrans.save();

    if (type === "promptpay") {
        res.json({ qr_code: result.data.source.scannable_code.image.download_uri });
    } else {
        res.json({ authorize_uri: result.data.authorize_uri });
    }
})

router.post("/business-register", verifyToken, async (req, res) => {
    try {
        const { businessName, businessType } = req.body;
        const userId = req.user.userId;
        const newServiceAcc = new ServiceAcc({
            userId,
            businessName,
            businessType
        })

        await newServiceAcc.save();

        const user = await User.findById(userId).exec()
        user.isServiceAcc = true;
        await user.save()
        res.json({ message: "service account created" })
    } catch (err) {
        console.log(err)
        res.sendStatus(500);
    }
})

router.get("/", verifyToken, async (req, res) => {
    try{
        const isServiceAcc = await ServiceAcc.exists({userId: req.user.userId});
        if(isServiceAcc) {
            res.json({ service: true, message: "This is a service account"});
        } else {
            res.json({ service: false, message: "Not a service account"})
        }
    } catch (err) {
        res.sendStatus(500)
    }
})

router.get("/account", verifyToken, async (req, res) => {
    try{
        const serviceAcc = await ServiceAcc.findOne({userId: req.user.userId}).exec();
        if(!serviceAcc) return res.sendStatus(404)
        console.log(serviceAcc.businessName);
        res.json({name: serviceAcc.businessName, type: serviceAcc.businessType})
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

router.get('/info', async (req, res) => {
    try{
        console.log(req.query.serviceId)
        const serviceAcc = await ServiceAcc.findById(req.query.serviceId).exec();
        if(!serviceAcc) return res.sendStatus(404)
        console.log(serviceAcc.businessName);
        res.json({name: serviceAcc.businessName, type: serviceAcc.businessType})
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

router.post("/generateQR", verifyToken, async (req, res) => {
    const serviceAcc = await ServiceAcc.findOne({userId:req.user.userId}).exec();
    if (!serviceAcc) return res.status(404).json({ message: 'user not found' });
    const generatedQR = await qr.toDataURL(`${baseURL}/qr?serviceId=${serviceAcc._id}`);
    res.json({ qrData: generatedQR })
})

router.get("/list", verifyToken, async (req, res) => {
    const serviceAcc = await ServiceAcc.findOne({userId:req.user.userId}).exec();
    if (!serviceAcc) return res.status(404).json({ message: 'user not found' });
    const serviceLists = await serviceTrans.find({serviceId: serviceAcc._id});
    res.json({serviceLists});
})


module.exports = router;