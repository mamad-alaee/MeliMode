const mongoose = require('mongoose')
const joi = require('joi')
const {Schema} = require("mongoose");
const {bool, string} = require("joi");



const orderschema = mongoose.Schema({
    userid :{
        type: mongoose.Schema.Types.ObjectId,
        ref : "user",
        required : true
    },
    productid:{
        type: mongoose.Schema.Types.ObjectId,
        ref : "product",
        required : true
    },
    amount:{
        type:Number,
    },
    color:{
        type: mongoose.Schema.Types.ObjectId,
        ref : "color",
        required : true
    },
    size:{
        type:String
    },
    status : {
        type:Boolean,
        default:false
    }
});

const order = mongoose.model("order",orderschema);


function orderValidator(order) {
    const schema = joi.object({
        productid: joi.string().required(),
        color: joi.string().required(),
        size: joi.string().required(),
        amount: joi.number().required(),
        status: joi.bool()
    })
    return schema.validate(order);
}

exports.orderschema = orderschema;
exports.order = order;
exports.orderValidator = orderValidator;