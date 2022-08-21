const express = require('express');
const router = express.Router();
const auth = require("../midelwaers/auth");
const isemployee = require("../midelwaers/isemployee");
const {product, productValidator} = require("../datamodels/productdm");
const validObjectid = require("../midelwaers/validObjectid");
const multer = require('multer');
const fs = require('fs');
const {order} = require("../datamodels/ordersdm");
const dir = 'img-uploads/';
const {ObjectId} = require('mongodb');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, dir)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E4)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
})
const multerimg = multer({storage: storage});

router
    .post("/", [auth, isemployee, multerimg.single("img")], async (req, res) => {

        try {
            const {error} = productValidator(req.body);
            if (error) return res.status(400).send([{message: "اطلاعات نامعتبر است"}, {error: error.details}]);
            console.log("=====>" + req.file.filename)
            const newproduct = new product({
                title: req.body.title,
                desc: req.body.desc,
                kind: req.body.kind,
                price: req.body.price,
                brand: req.body.brand,
                colors: req.body.colors,
                size: req.body.size,
                inventory: req.body.inventory,
                img: "http://localhost:3004/" + req.file.filename
            });
            const savedproduct = await newproduct.save();
            res.send(savedproduct).status(200);
        } catch (e) {
            return res.status(500).send("server Error");
        }
    })
    .get("/search", async (req, res) => {

        try {
            const search = req.query.search;
            console.log()
            const page = req.query.page;
            const skip = (page - 1) * 6;
            const limit = 6;
            const products = await product.find({"$or":[{title:{$regex:search}},{desc:{$regex:search}}]}).skip(skip).limit(limit).populate("colors").populate("kind");
            if (!products) return res.status(404).send({message: 'کالا مورد نظر یافت نشد'});
            res.send(products).status(200);
        } catch (e) {
            return res.status(500).send("server Error");
        }
    })
    .delete("/:id", [auth, isemployee, validObjectid], async (req, res) => {

        try {
            const product2 = await product.findByIdAndRemove(req.params.id);
            if (!product2) return res.status(404).send({message: 'کالا مورد نظر یافت نشد'});
            res.send(product2).status(200);
        } catch (e) {
            return res.status(500).send("server Error");
        }
    })
    .put("/:id", [auth, isemployee, validObjectid], async (req, res) => {

        try {
            const {error} = productValidator(req.body);
            if (error) return res.status(400).send({message: "اطلاعات نامعتبر است."});
            const newproduct = await product.findByIdAndUpdate(req.params.id,
                {
                    title: req.body.title,
                    desc: req.body.desc,
                    kind: req.body.kind,
                    price: req.body.price,
                    brand: req.body.brand,
                    colors: req.body.colors,
                    size: req.body.size,
                    inventory: req.body.inventory
                },
                {new: true});

            if (!newproduct) return res.status(404).send({message: 'کالا مورد نظر یافت نشد'});
            res.send(newproduct).status(200);
        } catch (e) {
            return res.status(500).send("server Error");
        }
    })
    .get("/", async (req, res) => {

        try {
            const kind = req.query.kind;
            const page = req.query.page;
            const color = req.query.color;
            const size = req.query.size;
            let find = {}
            console.log("===> " + color + size);

            (!size) ? console.log("undefined") : find.size = {$in: size};
            (!color) ? console.log("null") : find.colors = {$in: color};
            let sort = {title: 1};
            switch (req.query.sort) {
                case "ترتیب نمایش" :
                    break;
                case "بیشترین قیمت" :
                    sort = {price: -1};
                    break;
                case "کمترین قیمت" :
                    sort = {price: 1};
                    break;
                case "محبوب ترین" :
                    break;
                case "پرفروش ترین" :
                    break;
            }
            if (!page) {
                if (!kind) {
                    console.log("in not kind")
                    const xproducts = await product.find(find).sort(sort).select('_id title desc price brand size img colors inventory').populate("colors").populate("kind");
                    if (!xproducts) return res.status(404).send('کالایی وجود ندارد');
                    console.log("find ==> " + JSON.stringify(find) + "length => " + JSON.stringify(xproducts).length);
                    // xproducts.forEach((prod) => {remove_amount(prod)});
                    for (let x in xproducts) {
                        let amount = 0;
                        let xproduct = xproducts[x]
                        let product_in_basket_amount = await order.find({
                            productid: xproduct._id,
                            status: false
                        }).select("amount");
                        product_in_basket_amount.map(x => {
                            return amount += x.amount
                        })
                        console.log("mines => " + amount);
                        xproduct.inventory = xproduct.inventory - amount;
                    }
                    res.send(xproducts).status(200);

                } else {
                    console.log("in kind =>" + kind);
                    find.kind = kind;
                    const xproducts = await product.find(find).sort(sort).select('_id title desc price brand size img colors inventory').populate("colors").populate("kind");
                    if (!xproducts) return res.status(404).send('کالایی وجود ندارد');
                    console.log("find ==> " + JSON.stringify(find) + "length => " + JSON.stringify(xproducts).length);
                    res.send(xproducts).status(200);
                }
            } else {
                const skip = (page - 1) * 9;
                const limit = 9;
                console.log("skip " + skip + " limit " + limit);
                if (!kind) {
                    console.log("in not kind")
                    const xproducts = await product.find(find).skip(skip).limit(limit).sort(sort).select('_id title desc price brand size img colors inventory').populate("colors").populate("kind");
                    if (!xproducts) return res.status(404).send('کالایی وجود ندارد');
                    console.log("find ==> " + JSON.stringify(find) + "length => " + JSON.stringify(xproducts).length);
                    res.send(xproducts).status(200);
                } else {
                    console.log("in kind =>" + kind);
                    find.kind = kind;
                    const xproducts = await product.find(find).skip(skip).limit(limit).sort(sort).select('_id title desc price brand size img colors inventory').populate("colors").populate("kind");
                    if (!xproducts) return res.status(404).send('کالایی وجود ندارد');
                    console.log("find ==> " + JSON.stringify(find) + "length => " + JSON.stringify(xproducts).length);
                    res.send(xproducts).status(200);
                }
            }
        } catch (e) {
            return res.status(500).send("server Error");
        }
    })
    .get("/:id", validObjectid, async (req, res) => {
        try {
            const products = await product.findById(req.params.id).populate("color").populate("kind");
            if (!products) return res.status(404).send({message: 'کالا مورد نظر یافت نشد'});
            res.send(products).status(200);
        } catch (e) {
            return res.status(500).send("server Error");
        }

    })

module.exports = router;