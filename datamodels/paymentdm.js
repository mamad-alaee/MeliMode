const {required, bool} = require("joi");
const mongoose = require("mongoose");
const joi = require("joi");

const paymentschema = new mongoose.Schema({
    orders: {
        type : [mongoose.Schema.Types.ObjectId],
        ref: "order",
        required: true,
    },
    authority: {
        type: String,
    },
    amount: {
        type: Number,
        required: true,
    },
    status:{
        type : Boolean,
        required: true

    }
});


const payment = mongoose.model("payment", paymentschema);

function paymentValidator(paymentreq) {
    const schema = joi.object({
        orders : joi.array().required(),
        authority : joi.string(),
        amount : joi.number().required(),
        status : joi.boolean().required()
    });
    return schema.validate(paymentreq);

}

exports.paymentschema = paymentschema;
exports.payment = payment;
exports.paymentValidator = paymentValidator;
