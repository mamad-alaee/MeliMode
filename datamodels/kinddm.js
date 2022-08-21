const mongoose =require("mongoose");
const joi = require("joi");



const kindschema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
    },

});

const kind = mongoose.model("kind",kindschema);

function kindValidator(kind) {
    const schema = joi.object({
        name: joi.string().min(2).max(50).required(),
    });
    return schema.validate(kind);

}

exports.kindschema = kindschema;
exports.kind = kind;
exports.kindValidator = kindValidator;