const mongoose =require("mongoose");
const joi = require("joi");



const colorSchema = new mongoose.Schema({
    farsi : {
        type: String,
        required: true

    },
    eng : {
        type: String,
        required: true

    },
    hashcode : {
        type: String,
        required: true
    },

});

const color = mongoose.model("color",colorSchema);


exports.colorSchema = colorSchema;
exports.color = color;
