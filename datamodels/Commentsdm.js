const mongoose = require('mongoose')
const joi = require('joi')
const {Schema} = require("mongoose");
const {bool, string} = require("joi");



const commentschema = mongoose.Schema({
    userid :{
        type: mongoose.Schema.Types.ObjectId,
        ref : "user",
        required : true
    },
    title:{
        type: String,
        required : true
    },
    desc:{
        type:String,
        required : true
    }
  });

const comment = mongoose.model("comment",commentschema);


function commentValidator(order) {
    const schema = joi.object({
        userid: joi.string().required(),
        title: joi.string().required(),
        desc: joi.string().required(),
    })
    return schema.validate(order);
}

exports.commentschema = commentschema;
exports.comment = comment;
exports.commentValidator = commentValidator;