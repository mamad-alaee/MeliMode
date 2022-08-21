const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const {user, userValidator,updateUserValidator} = require("../datamodels/userdm");
const auth = require("../midelwaers/auth");
const admin = require("../midelwaers/admin");
const isemployee = require("../midelwaers/isemployee");
const isEmployeeOrSameUser = require("../midelwaers/isEmployeeOrSameUser");


router
    .post("/", async (req, res) => {

        try {
            const {error} = userValidator(req.body);
            if (error) return res.status(400).send([{message: "اطلاعات نامعتبر است"}, {error: error}]);

            let email = "empty"
            if (req.body.email) {
                email = req.body.email;
                const user2 = await user.findOne({email: req.body.email});
                if (user2) return res.status(404).send({message: 'این ایمیل تکراری می باشد'});
            }
            if (req.body.number) {
                const user3 = await user.findOne({number: req.body.number});
                if (user3) return res.status(404).send({message: 'این شماره تلفن تکراری می باشد'});
            }



            const saltRounds = 10;
            const pass = await bcrypt.hash(req.body.password, saltRounds);

            const newuser = new user({
                name: req.body.name,
                family: req.body.family,
                email: email,
                number: req.body.number,
                zipcode: req.body.zipcode,
                address: req.body.address,
                password: pass,
                isadmin: false,
                isemployee: false,
                userwallet: []
            });
            const saveduser = await newuser.save();

            const token = saveduser.generateAuthToken();
            res.header("x-auth-token", token).send({message: "خوش آمدید"});
        } catch (e) {
            return res.status(500).send("server Error");
        }
    })
    .post("/admin/", [auth, admin], async (req, res) => {

        try {
            const {error} = userValidator(req.body);
            if (error) return res.status(400).send([{message: "اطلاعات نامعتبر است"},
                {error: error}]);


            const user3 = await user.findOne({number: req.body.number});
            console.log("++++++++++++ +++++++++ +++++++++++ +++++++++++> user3" + user3);
            if (user3) {
                console.log("++++++++++++ +++++++++ +++++++++++ +++++++++++> in user3" + user3);
                return res.status(404).send({message: 'این شماره تلفن تکراری می باشد'})
            }


            const user2 = await user.findOne({email: req.body.email});
            console.log("++++++++++++ +++++++++ +++++++++++ +++++++++++> user2" + user2);
            if (user2) {
                return res.status(404).send({message: 'این ایمیل تکراری می باشد'});
            }

            const saltRounds = 10;
            const pass = await bcrypt.hash(req.body.password, saltRounds);

            const newuser = new user({
                name: req.body.name,
                family: req.body.family,
                email: req.body.email,
                number: req.body.number,
                zipcode: req.body.zipcode,
                address: req.body.address,
                password: pass,
                isadmin: req.body.isadmin,
                isemployee: req.body.isemployee,
                userwallet: []
            });
            const saveduser = await newuser.save();

            const token = saveduser.generateAuthToken();
            res.header("x-auth-token", token).status(200).send({message: "خوش آمدید"});
        } catch (e) {
            return res.status(500).send("server Error");
        }
    })
    .delete("/:id", [auth, admin], async (req, res) => {


        try {
            const user2 = await user.findByIdAndRemove(req.params.id);
            if (!user2) return res.status(404).send({message: 'کاربری با این نام کاربری وجود ندارد'});
            res.send(user2).status(200);
        } catch (e) {
            return res.status(500).send("server Error");
        }

    })
    .put("/", [auth], async (req, res) => {

        try {
            const {error} = updateUserValidator(req.body);
            if (error) return res.status(400).send({message: "اطلاعات نامعتبر است."});

            const newuser = await user.findByIdAndUpdate(req.user._id,
                {
                    name: req.body.name,
                    family: req.body.family,
                    email: req.body.email,
                    number: req.body.number,
                    zipcode: req.body.zipcode,
                    address: req.body.address,
                }, {new: true});

            if (!newuser) return res.status(404).send({message: 'کاربری با این نام کاربری وجود ندارد'});
            res.send(newuser).status(200);
        } catch (e) {
            return res.status(500).send("server Error");
        }
    })
    .put("/admin/:id", [auth, admin], async (req, res) => {

        try {
            const {error} = userValidator(req.body);
            console.log("error is  =======================================> =======================================> =======================================>" + error);
            if (error) return res.status(400).send({message: "اطلاعات نامعتبر است."});

            const newuser = await user.findByIdAndUpdate(req.params.id,
                {
                    name: req.body.name,
                    family: req.body.family,
                    email: req.body.email,
                    number: req.body.number,
                    zipcode: req.body.zipcode,
                    address: req.body.address,
                    isadmin: req.body.isadmin,
                    isemployee: req.body.isadmin,
                    userwallet: []

                }, {new: true});

            if (!newuser) return res.status(404).send({message: 'کاربری با این نام کاربری وجود ندارد'});
            res.send(newuser).status(200);
        } catch (e) {
            return res.status(500).send("server Error");
        }
    })
    .get("/address/", [auth], async (req, res) => {

        try {
            console.log("address");
            const newuser = await user.findById(req.user._id).select("name family email number address zipcode")
            if (!newuser) return res.status(404).send({message: 'کاربری با این نام کاربری وجود ندارد'});
            res.send(newuser).status(200);
        } catch (e) {
            return res.status(500).send("server Error");
        }

    })
    .get("/id/:id", [isEmployeeOrSameUser], async (req, res) => {

        try {
            const users = await user.findById(req.params.id)
                .populate("userwallet", "_id name family email number isadmin isemployee");
            if (!users) return res.status(404).send({message: 'کاربری با این نام کاربری وجود ندارد'});
            res.send(users).status(200);
        } catch (e) {
            return res.status(500).send("server Error");
        }
    })
    .get("/", [auth, isemployee], async (req, res) => {
        try {
            const users = await user.find().sort("name")
                .populate("userwallet", "_id name family email number isadmin isemployee");
            if (!users) return res.status(404).send({message: 'کاربری با این نام کاربری وجود ندارد'});
            res.send(users).status(200);
        } catch (e) {
            return res.status(500).send("server Error");
        }

    })


module.exports = router;
