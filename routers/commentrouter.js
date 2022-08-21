const express = require('express');
const router = express.Router();
const {comment, commentValidator} = require("../datamodels/Commentsdm");
const isemployee = require("../midelwaers/isemployee")
const auth = require("../midelwaers/auth")
const {userValidator} = require("../datamodels/userdm");

router
    .get('/', [auth, isemployee], async (req, res) => {

        try {
            const comments = comment.find();
            if (!comments) res.send("نظری موجود نیست").status(404);
            res.send(comments).status(200);
        } catch (e) {
            return res.status(500).send("server Error");
        }

    })
    .post("/", [auth], async (req, res) => {
        try {
            req.body.userid = req.user._id;
            const {error} = commentValidator(req.body);
            if (error) return res.status(400).send({message: "اطلاعات نامعتبر است", error: error});
            const new_message = new comment({
                userid: req.body.userid,
                title: req.body.title,
                desc: req.body.desc
            })
            const result = await new_message.save();
            if (!result) res.send({message: "مشکلی پیش آمده لطفا بعدا امتحان کنید"}).status(500);
            res.send("پیام شما با موفقیت ثبت شد").status(200)
        } catch (e) {
            return res.status(500).send("server Error");
        }
    });


module.exports = router;

