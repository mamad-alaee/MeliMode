const express = require("express");
const userrouter = require("../routers/userrouter");
const productrouter = require("../routers/productrouter");
const kindrouter = require("../routers/kindrouter");
const authrouter = require("../routers/authrouter");
const usecases = require("../routers/usecases");
const paymentrouter = require("../routers/paymentrouter");
const orderrouter = require("../routers/orderrouter");
const commentrouter = require("../routers/commentrouter");

module.exports=function (app) {
    app.use(express.json());
    app.use(express.static('img-uploads'))
    app.use("/api/user",userrouter);
    app.use("/api/product",productrouter);
    app.use("/api/kind",kindrouter);
    app.use("/api/auth",authrouter);
    app.use("/api/use-cases",usecases);
    app.use("/api/payment",paymentrouter);
    app.use("/api/order",orderrouter);
    app.use("/api/comment",commentrouter);

}