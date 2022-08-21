const express = require("express");
const router = express.Router();
const {payment} = require('../datamodels/paymentdm');
const auth = require("../midelwaers/auth");
const joi = require("joi");
const axios = require("axios");
const validObjectid = require("../midelwaers/validObjectid");
const {product} = require("../datamodels/productdm");
const {order} = require("../datamodels/ordersdm");
const {user} = require("../datamodels/userdm");

const paymentReq_validator = (paymentReq) => {
    const schema = joi.object({
        orders: joi.array().required(),
        authority: joi.string(),
        amount: joi.number().required(),
        CallbackURL: joi.string().required(),
        Description: joi.string().required(),

    });
    return schema.validate(paymentReq);
}
const paymentConfrimation_validator = (paymentConfrimation) => {
    const schema = joi.object({
        authority: joi.string(),
        status: joi.string(),
    });
    return schema.validate(paymentConfrimation);
}
router
    .post("/", [auth], async (req, res) => {
        try {
            const our_user = await user.find({_id: req.user._id});
            const {error} = paymentReq_validator(req.body)
            if (error) return res.status(400).send([{message: "اطلاعات نامعتبر است"}, {error: error.details}]);
            const params = {
                merchant_id: "443bbde4-79f7-11e8-8196-005056a205be",
                // amount: req.body.amount,
                amount: 1000,
                callback_url: req.body.CallbackURL,
                // callback_url:"http://localhost:3004/api/payment/verfication",
                description: req.body.Description,
                metadata: {
                    mobile: our_user.number,
                    email: our_user.email
                }
            };
            console.log(params);
            const zarin_res = await axios.post("https://api.zarinpal.com/pg/v4/payment/request.json", params);
            console.log(zarin_res.headers);
            console.log(zarin_res.data);
            console.log(zarin_res.status);
            console.log(zarin_res.data.errors.validations);
            if (zarin_res.data.data.code === 100) {
                const newpayment = new payment({
                    orders: req.body.orders,
                    authority: zarin_res.data.data.authority,
                    amount: req.body.amount,
                    status: false
                });
                const savedpayment = await newpayment.save();
                if (savedpayment) {
                    res.status(200).send({
                        "url": "https://www.zarinpal.com/pg/StartPay/",
                        "authority": zarin_res.data.data.authority
                    });
                }


            } else {
                res.status(500).send("درگاه پرداخت دچار مشکل شده است لطفا بعدا امتحان کنید!");
            }
        } catch (e) {
            return res.status(500).send("server Error");
        }


    })

    .post("/confrimation", [auth], async (req, res) => {
        try {
            console.log("confrimation");
            let paymentreq;
            const {error} = paymentConfrimation_validator(req.body)
            console.log("confrimation req body authority" + JSON.stringify(req.body.authority));
            console.log("confrimation req body status " + JSON.stringify(req.body.status));
            if (error) return res.status(400).send({message: "اطلاعات نامعتبر است", paymentId: paymentreq._id});
            paymentreq = await payment.find({authority: req.body.authority});
            if (req.body.status === "OK") {
                console.log("in ok");
                console.log("paymentreq is ==> " + JSON.stringify(paymentreq));
                if (!paymentreq) {
                    console.log("in !paymentreq");
                    res.status(400).send({
                        message: "رسیدی برای پرداخت با این مشخصات وجود ندارد! لطفا با پشتیبان سایت تماس برقرار کنید.",
                        paymentId: paymentreq._id
                    });

                } else {
                    const params = {
                        merchant_id: "443bbde4-79f7-11e8-8196-005056a205be",
                        // amount: paymentreq.amount,
                        amount: 1000,
                        authority: req.body.authority,
                    }
                    console.log("params sended to zarinpal => " + JSON.stringify(params))
                    const zarin_res = await axios.post("https://api.zarinpal.com/pg/v4/payment/verify.json", params).catch(function (err) {
                        console.log(err);
                        res.status(400).send({
                            message: "رسید خرید شما توسط زرین پال تایید نشد. لطفا با پشتیبان تماس برقرار کنید. ",
                            paymentId: paymentreq[0]._id
                        });
                    });
                    console.log(zarin_res.data);
                    console.log(zarin_res.data.data);
                    console.log(zarin_res.data.data.code);
                    if (zarin_res.data.data.code == 100) {
                        console.log("paymentreq is ==> " + JSON.stringify(paymentreq));
                        console.log("paymentreq orders is ==> " + JSON.stringify(paymentreq[0].orders));
                        paymentreq[0].orders.map(async (id) => {
                            console.log(id)
                            console.log("order2 is ==> " + JSON.stringify(id));
                            const done_orderreq = await order.findByIdAndUpdate(id, {status: true}, {new: true});
                            if (!done_orderreq) {
                                res.status(500).send({
                                    message: "سفارش خرید شما با موفقیت تکمیل نشد لطفا با پشتیبان سایت تماس برقرار کنید.",
                                    paymentId: paymentreq[0]._id
                                });
                            }
                            console.log(done_orderreq);
                            const productid = done_orderreq.productid;
                            const colorid = done_orderreq.color;
                            const size = done_orderreq.size;
                            const deleting_color_and_size = await product.findByIdAndUpdate(
                                productid,
                                {$pull: {colors: colorid, size: size}},
                                {new: true}
                            );
                            if (!deleting_color_and_size) {
                                res.status(500).send({
                                    message: "سفارش خرید شما با موفقیت تکمیل نشد لطفا با پشتیبان سایت تماس برقرار کنید.",
                                    paymentId: paymentreq[0]._id
                                });
                            }
                            console.log(deleting_color_and_size);


                        });
                        const result = await payment.findByIdAndUpdate(paymentreq[0]._id, {status: true});
                        if (!result) {
                            res.status(500).send({
                                message: "سفارش خرید شما با موفقیت تکمیل نشد لطفا با پشتیبان سایت تماس برقرار کنید.",
                                paymentId: paymentreq[0]._id
                            });
                        }
                        res.status(200).send({
                            message: "سفارش خرید شما با موفقیت ثبت گردید و بزودی برای شما ارسال می گردد.",
                            paymentId: paymentreq[0]._id
                        });


                    } else {
                        res.status(400).send({
                            message: "رسید خرید شما توسط زرین پال تایید نشد. لطفا با پشتیبان تماس برقرار کنید. ",
                            paymentId: paymentreq[0]._id
                        });

                    }
                }
            } else {
                await payment.findOneAndDelete({authority: req.body.authority});
                res.status(400).send({message: "سفارش خرید تکمیل نشد.", paymentId: paymentreq[0]._id});
            }
        } catch (e) {
            return res.status(500).send("server Error");
        }
    })
    .get("/", async (req, res) => {

        try {
            const payments = await payment.find();
            if (!payments) return res.status(404).send({message: 'کالا مورد نظر یافت نشد'});
            res.send(payments).status(200);
        } catch (e) {
            return res.status(500).send("server Error");
        }
    });

module.exports = router;

