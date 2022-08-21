const joi = require('joi');
const bcrypt = require('bcrypt');
const {user} = require('../datamodels/userdm');
const express = require('express');
const router = express.Router();

router
    .post('/', async (req, res) => {
        try {
            const {error} = validate(req.body);
            if (error) return res.status(400).send("invalid data");

            let user1;
            if (!req.body.email) {
                user1 = await user.findOne({number: req.body.number});
                console.log( " number " + user1)
            }
            else {
                user1 = await user.findOne({email: req.body.email});
                console.log("email " + user1 )
            }

            if (!user1) {
                return res.status(400).send('کاربری با این شماره و ایمیل ثبت نشده است')
            } else {
                const validPassword = await bcrypt.compare(req.body.password, user1.password);
                if (!validPassword) return res.status(400).send('رمز عبور اشتباه است');

                const token = user1.generateAuthToken();
                const data_send = {
                    text: "خوش آمدید",
                    name: user1.name,
                    family: user1.family,

                }
                res.header("x_auth_token", token).send(data_send).status(200);
            }
        }
        catch (e){
            return res.status(500).send("server Error");
        }
    });

function validate(user) {
    const schema = joi.object({
        number: joi.string().min(10).max(11).required(),
        password: joi.string().min(6).max(255).alphanum().required()
    });
    return schema.validate(user);

}

module.exports = router;

