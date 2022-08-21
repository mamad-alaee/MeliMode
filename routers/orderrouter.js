const express = require("express");
const router = express.Router();
const {payment} = require('../datamodels/paymentdm');
const auth = require("../midelwaers/auth");
const axios = require("axios");
const {order, orderValidator} = require("../datamodels/ordersdm");
const joi = require("joi");
const validObjectid = require("../midelwaers/validObjectid");

router
    .post("/", [auth], async (req, res) => {

        try {
            const {error} = orderValidator(req.body)
            if (error) return res.status(400).send([{message: "اطلاعات نامعتبر است"}, {error: error.details}]);
            const neworder = new order({
                userid: req.user._id,
                productid: req.body.productid,
                amount: req.body.amount,
                color: req.body.color,
                size: req.body.size,
                status: false
            });
            const saved = await neworder.save();
            res.send("کالای مورد نظر به سبد خرید شما اضافه گردید.").status(200);
        } catch (e) {
            return res.status(500).send("server Error");
        }
    })
    .get("/", auth, async (req, res) => {

        try {
            const status = req.query.status;
            const userid = req.user._id;
            const orders = await order.find({status: status, userid: userid}).populate("productid").populate("color");
            if (!orders) return res.status(404).send({message: 'سفارشی موجود نیست'});
            console.log(orders);
            res.status(200).send(orders);
        } catch (e) {
            return res.status(500).send("server Error");
        }

    })
    .get("/number", [auth], async (req, res) => {

        // res.send(orders.length).status(200);
        try {
            const status = req.query.status;
            const userid = req.user._id;
            console.log("user id"+ userid + " status " + status)
            const orders = await order.find({status: status, userid: userid});
            if (!orders) return res.status(404).send({message: 'سفارشی موجود نیست'});
            console.log(orders.length);
            res.status(200).send(orders.length.toString());
        } catch (e) {
            return res.status(500).send("server Error");
        }

    })
    .get("/justorders", auth, async (req, res) => {

        try {
            const status = req.query.status;
            const userid = req.user._id;
            const orders = await order.find({status: status, userid: userid}).select('productid color size amount').populate("productid","title desc img price").populate("color");
            if (!orders) return res.status(404).send({message: 'سفارشی موجود نیست'});
            console.log(orders);
            res.status(200).send(orders);
        } catch (e) {
            return res.status(500).send("server Error");
        }

    })
    .delete("/:id",[auth],async (req ,res) => {
        try {
            const id = req.params.id;
            const deleted_order = await order.findOneAndRemove(id);
            if (!deleted_order) res.send("همچین درخواست خریدی وجود ندارد").status(404);
            res.send("درخواست خرید شما با موفقیت حذف گردید!").status(200)
        } catch (e) {
            return res.status(500).send("server Error");
        }
    });

module.exports = router;

