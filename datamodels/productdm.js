const mongoose = require('mongoose')
const joi = require('joi')
const {Schema} = require("mongoose");



const productschema = mongoose.Schema({
    title :{
        type : String,
        required:true,
        minLength:2,
        maxLength:15
    },
    desc:{
        type : String,
        required:true,
        minLength:10,
        maxLength:250
    },
    img:{
        type:String,
    },
    kind:{
        type: mongoose.Schema.Types.ObjectId,
        ref : "kind",
        required : true
    },
    price:{
        type : Number,
        required: true,
        minLength:1,
        maxLength:9
    },
    brand:{
        type : String,
        required:true,
        minLength:2,
        maxLength:50
    },
    colors:{
        type : [mongoose.Schema.Types.ObjectId],
        ref : "color",
        required:true,
        minLength:1,
        maxLength:150
    },
    size:{
        type : [String],
        required:true,
        minLength:1,
        maxLength:150
    },
    inventory : {
        type : Number,
        required : true,
    },


});

const product = mongoose.model("product",productschema);


function productValidator(product) {
    console.log(product);
    product.colors = JSON.parse(product.colors);
    product.size = JSON.parse(product.size);
    const schema = joi.object({
        title: joi.string().min(2).max(20).required(),
        desc: joi.string().min(10).max(250).required(),
        kind: joi.string().required(),
        price: joi.number().min(1).max(100000000).required(),
        brand : joi.string().required(),
        colors : joi.array().required(),
        size : joi.array().required(),
        inventory : joi.number().min(1).required(),
        img:joi.object()

    })
    return schema.validate(product);
}

exports.productschema = productschema;
exports.product = product;
exports.productValidator = productValidator;