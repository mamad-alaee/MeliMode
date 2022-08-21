const mongoose = require("mongoose");
const joi = require("joi");
const jwt = require('jsonwebtoken');


const userschema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 2,
        maxlength: 50,
    },
    family: {
        type: String,
        minlength: 2,
        maxlength: 100,
    },
    email: {
        type: String,
        unique: true
    },
    number: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 255
    },
    address: {
        type: String,
        minlength: 10
    },
    zipcode: {
        type: String,
        minlength: 10,
        maxlength: 10
    },
    isadmin: {
        type: Boolean,
        default: 'false',
        required: false

    },
    isemployee: {
        type: Boolean,
        default: 'false',
        required: false
    },
    userwallet: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'product'
    }

});


userschema.methods.generateAuthToken = function () {
    const token = jwt.sign({
        _id: this._id,
        isemployee: this.isemployee,
        isadmin: this.isadmin
    }, process.env.jwtPrivateKey);
    return token;
}


const user = mongoose.model("user", userschema);


function userValidator(user) {
    const schema = joi.object({
        name: joi.string().min(2).max(50),
        family: joi.string().min(2).max(100),
        email: joi.string().email(),
        password: joi.string().min(6).max(255).alphanum().required(),
        number: joi.string().min(10).max(11).required(),
        zipcode: joi.string().min(10).max(10),
        address: joi.string().min(10),
        isadmin: joi.bool(),
        isemployee: joi.bool(),
        userwallet: joi.array().required()

    });
    return schema.validate(user);

}
function updateUserValidator(user) {
    const schema = joi.object({
        name: joi.string().min(2).max(50),
        family: joi.string().min(2).max(100),
        email: joi.string().email(),
        number: joi.string().min(10).max(11).required(),
        zipcode: joi.string().min(10).max(10),
        address: joi.string().min(10),
    });
    return schema.validate(user);

}

exports.userschema = userschema;
exports.user = user;
exports.userValidator = userValidator;
exports.updateUserValidator = updateUserValidator;

