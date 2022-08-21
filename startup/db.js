const mongoose = require("mongoose");


module.exports = function () {
   mongoose.connect("mongodb://localhost/melimode")
       .then(res => console.log("connected to db"));
}


