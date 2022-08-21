const mongoose =require("mongoose");
const joi = require("joi");



const sizeSchema = new mongoose.Schema({
    size : {
        type: String,
        required: true

    }

});

const size = mongoose.model("size",sizeSchema);


exports.sizeSchema = sizeSchema;
exports.size = size;
