const express = require('express');
const router = express.Router();
const {kind, kindValidator} = require("../datamodels/kinddm");
const auth = require("../midelwaers/auth");
const admin = require("../midelwaers/admin");
const isemployee = require("../midelwaers/isemployee");
const validObjectid = require("../midelwaers/validObjectid")


router
    .post("/", [auth, isemployee], async (req, res) => {
        try {
            const {error} = kindValidator(req.body);
            if (error) return res.status(400).send({message: "دسته بندی نامعتبر است"});
            const newkind = new kind({
                name: req.body.name,
            });
            const savekind = await newkind.save();
            res.send(savekind).status(200);
        } catch (e) {
            return res.status(500).send("server Error");
        }

    })
    .delete("/:id", [auth, isemployee, validObjectid], async (req, res) => {
        try {
            const kind2 = await kind.findByIdAndRemove(req.params.id);
            if (!kind2) return res.status(404).send({message: 'دسته بندی مورد نظر پیدا نشد'});
            res.send(kind2).status(200);
        } catch (e) {
            return res.status(500).send("server Error");
        }
    })
    .put("/:id", [auth, isemployee, validObjectid], async (req, res) => {
        try {
            const {error} = kindValidator(req.body);
            if (error) return res.status(400).send({message: "دسته بندی نامعتبر است"});

            const newkind = await kind.findByIdAndUpdate(req.params.id,
                {
                    name: req.body.name,
                }, {new: true});

            if (!newkind) return res.status(404).send({message: 'دسته بندی مورد نظر پیدا نشد'});
            res.send(newkind).status(200);
        } catch (e) {
            return res.status(500).send("server Error");
        }

    })
    .get("/", async (req, res) => {

        try {
            const kinds = await kind.find().sort("name");
            if (!kinds) return res.status(404).send('دسته بندی موجود نیست');
            res.send(kinds).status(200);
        } catch (e) {
            return res.status(500).send("server Error");
        }

    })

    .get("/:id", validObjectid, async (req, res) => {

        try {
            const kinds = await kind.findById(req.params.id).sort("name");
            if (!kinds) return res.status(404).send('دسته بندی مورد نظر پیدا نشد');
            res.send(kinds);
        } catch (e) {
            return res.status(500).send("server Error");
        }

    });

module.exports = router;