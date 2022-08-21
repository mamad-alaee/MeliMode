const express = require('express');
const router = express.Router();
const {color} = require('../datamodels/color')
const {size} = require('../datamodels/sizedm')
const {response} = require("express");

router
    .get('/', async (req, res) => {

        try {
            switch (req.query.wantwhat){
                case "color" :
                    const colors = await color.find();
                    if (!colors){
                        res.send("رنگی وجود ندارد").status(400);
                    }
                    res.send(colors).status(200);
                    break;
                case "size" :
                    const sizes = await size.find();
                    if (!sizes){
                        res.send("رنگی وجود ندارد").status(400);
                    }
                    res.send(sizes).status(200);
                    break;
            }
        } catch (e) {
            return res.status(500).send("server Error");
        }
});



module.exports = router;

