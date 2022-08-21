const mongoose = require("mongoose");
const {kind} = require("../datamodels/kinddm");
const {user} = require("../datamodels/userdm");
const request = require("supertest");

let server;



describe('/api/kind', () => {
    beforeEach(() => { server = require('../app'); })
    afterEach(async () => {
        server.close();
        await kind.remove({});
        await user.remove({});
    });
    describe('Get', () => {
        it('should return kinds', async () => {
            const kinds = [{"name":"Genesis"},
                {"name":"Starion"},
                {"name":"B-Series Plus"},
                {"name":"RAV4"},
                {"name":"Accord Crosstour"}];
            await kind.collection.insertMany(kinds);
            const res = await request(server).get('/api/kind/');
            expect(res.status).toBe(200);
            expect(res.body[1]).toHaveProperty("name");
        });
        it('should return 403 if objectId is not valid', async () => {
            const kinds = [{"name":"Genesis"},
                {"name":"Starion"},
                {"name":"B-Series Plus"},
                {"name":"RAV4"},
                {"name":"Accord Crosstour"}];
            await kind.collection.insertMany(kinds);
            const kind1 = await kind.findOne({ name: "Starion" }).select("_id");
            let id = kind1['id'];
            id += "a23";
            const res = await request(server).get('/api/kind/' + id);
            expect(res.status).toBe(400);
            expect(res.body.message).toEqual('آیدی ارسال شده نامعتبر است')
        });
        it('should return 404 if product not found', async () => {
            const kinds = [{"name":"Genesis"},
                {"name":"Starion"},
                {"name":"B-Series Plus"},
                {"name":"RAV4"},
                {"name":"Accord Crosstour"}];
            await kind.collection.insertMany(kinds);
            const kind1 = await kind.findOne({ name: "Starion" }).select("_id");
            let id = kind1['id'];
            await kind.findByIdAndRemove(id);
            id += "a23";
            const res = await request(server).get('/api/kind/' + id);
            expect(res.status).toBe(400);
            expect(res.body.message).toEqual('آیدی ارسال شده نامعتبر است')
        });
        it('should return kind if objectId is valid', async () => {
            const kinds = [{"name":"Genesis"},
                {"name":"Starion"},
                {"name":"B-Series Plus"},
                {"name":"RAV4"},
                {"name":"Accord Crosstour"}];
            await kind.collection.insertMany(kinds);
            const kind1 = await kind.findOne({ name: "Starion" }).select("_id");
            let id = kind1['id'];
            const res = await request(server).get('/api/kind/' + id);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name');
        });
    });
    describe('Delete /', () => {
        it('should return 401 if u are not log in', async () => {
            const kinds = [{"name":"Genesis"},
                {"name":"Starion"},
                {"name":"B-Series Plus"},
                {"name":"RAV4"},
                {"name":"Accord Crosstour"}];
            await kind.collection.insertMany(kinds);
            const kind1 = await kind.findOne({"name":"Starion"}).select("_id");
            let id = kind1['id'];
            const res = await request(server)
                .delete('/api/kind/' + id)
            expect(res.status).toBe(401);
            expect(res.body.message).toEqual('دسترسی شما به این قسمت محدود می باشد.')
        });
        it('should return 403 if token is invalid', async () => {
            let token = new user().generateAuthToken();
            token += "12"
            const kinds = [{"name":"Genesis"},
                {"name":"Starion"},
                {"name":"B-Series Plus"},
                {"name":"RAV4"},
                {"name":"Accord Crosstour"}];
            await kind.collection.insertMany(kinds);
            const kind1 = await kind.findOne({"name":"Starion"}).select("_id");
            let id = kind1['id'];
            const res = await request(server)
                .delete('/api/kind/' + id)
                .set('x-auth-token', token);
            expect(res.status).toBe(403);
            expect(res.body.message).toEqual('توکن ارسالی نامعتبر می باشد');
        });
        it('should return 403 if u are not employee', async () => {
            let token = new user().generateAuthToken();
            const kinds = [{"name":"Genesis"},
                {"name":"Starion"},
                {"name":"B-Series Plus"},
                {"name":"RAV4"},
                {"name":"Accord Crosstour"}];
            await kind.collection.insertMany(kinds);
            const kind1 = await kind.findOne({"name":"Starion"}).select("_id");
            let id = kind1['id'];
            const res = await request(server)
                .delete('/api/kind/' + id)
                .set('x-auth-token', token);
            expect(res.status).toBe(403);
            expect(res.body.message).toEqual('دسترسی ممنوع')
        });
        it('should return 403 if objectId is not valid', async () => {
            let token = await creatEmployeeUser();
            const kinds = [{"name":"Genesis"},
                {"name":"Starion"},
                {"name":"B-Series Plus"},
                {"name":"RAV4"},
                {"name":"Accord Crosstour"}];
            await kind.collection.insertMany(kinds);
            const kind1 = await kind.findOne({"name":"Starion"}).select("_id");
            let id = kind1['id'];
            id += "a23";
            const res = await request(server)
                .delete('/api/kind/' + id)
                .set('x-auth-token', token);
            expect(res.status).toBe(400);
            expect(res.body.message).toEqual('آیدی ارسال شده نامعتبر است')
        });
        it('should return 404 if product not found', async () => {
            let token = await creatEmployeeUser();
            const kinds = [{"name":"Genesis"},
                {"name":"Starion"},
                {"name":"B-Series Plus"},
                {"name":"RAV4"},
                {"name":"Accord Crosstour"}];
            await kind.collection.insertMany(kinds);
            const kind1 = await kind.findOne({"name":"Starion"}).select("_id");
            let id = kind1['id'];
            await kind.findByIdAndRemove(id);
            const res = await request(server)
                .delete('/api/kind/' + id)
                .set('x-auth-token', token);
            expect(res.status).toBe(404);
            expect(res.body.message).toEqual('دسته بندی مورد نظر پیدا نشد')
        });
        it('should delete kind', async () => {
            let token = await creatEmployeeUser();
            const kinds = [{"name":"Genesis"},
                {"name":"Starion"},
                {"name":"B-Series Plus"},
                {"name":"RAV4"},
                {"name":"Accord Crosstour"}];
            await kind.collection.insertMany(kinds);
            const kind1 = await kind.findOne({"name":"Starion"}).select("_id");
            let id = kind1['id'];
            const res = await request(server)
                .delete('/api/kind/' + id)
                .set('x-auth-token', token);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name');
        });

    });
    describe('Put /', () => {
        it('should return 401 if u are not log in', async () => {
            const kinds = [{"name":"Genesis"},
                {"name":"Starion"},
                {"name":"B-Series Plus"},
                {"name":"RAV4"},
                {"name":"Accord Crosstour"}];
            const newkind = {"name":"salam"};
            await kind.collection.insertMany(kinds);
            const kind1 = await kind.findOne({"name":"Starion"}).select("_id");
            let id = kind1['id'];
            const res = await request(server)
                .put('/api/kind/' + id)
                .send(newkind);
            expect(res.status).toBe(401);
            expect(res.body.message).toEqual('دسترسی شما به این قسمت محدود می باشد.')
        });
        it('should return 403 if token is invalid', async () => {
            let token = new user().generateAuthToken();
            token += "12"
            const kinds = [{"name":"Genesis"},
                {"name":"Starion"},
                {"name":"B-Series Plus"},
                {"name":"RAV4"},
                {"name":"Accord Crosstour"}];
            const newkind = {"name":"salam"};
            await kind.collection.insertMany(kinds);
            const kind1 = await kind.findOne({"name":"Starion"}).select("_id");
            let id = kind1['id'];
            const res = await request(server)
                .put('/api/kind/' + id)
                .set('x-auth-token', token)
                .send(newkind);
            expect(res.status).toBe(403);
            expect(res.body.message).toEqual('توکن ارسالی نامعتبر می باشد');
        });
        it('should return 403 if u are not employee', async () => {
            let token = new user().generateAuthToken();
            const kinds = [{"name":"Genesis"},
                {"name":"Starion"},
                {"name":"B-Series Plus"},
                {"name":"RAV4"},
                {"name":"Accord Crosstour"}];
            const newkind = {"name":"salam"};
            await kind.collection.insertMany(kinds);
            const kind1 = await kind.findOne({"name":"Starion"}).select("_id");
            let id = kind1['id'];
            const res = await request(server)
                .put('/api/kind/' + id)
                .set('x-auth-token', token)
                .send(newkind);
            expect(res.status).toBe(403);
            expect(res.body.message).toEqual('دسترسی ممنوع')
        });
        it('should return 400 if data is not valid', async () => {
            let token = await creatEmployeeUser();
            const kinds = [{"name":"Genesis"},
                {"name":"Starion"},
                {"name":"B-Series Plus"},
                {"name":"RAV4"},
                {"name":"Accord Crosstour"}];
            const newkind = {"name":"s"};
            await kind.collection.insertMany(kinds);
            const kind1 = await kind.findOne({"name":"Starion"}).select("_id");
            let id = kind1['id'];
            const res = await request(server)
                .put('/api/kind/' + id)
                .set('x-auth-token', token)
                .send(newkind);
            expect(res.status).toBe(400);
            expect(res.body.message).toEqual("دسته بندی نامعتبر است")
        });
        it('should return 403 if objectId is not valid', async () => {
            let token = await creatEmployeeUser();
            const kinds = [{"name":"Genesis"},
                {"name":"Starion"},
                {"name":"B-Series Plus"},
                {"name":"RAV4"},
                {"name":"Accord Crosstour"}];
            const newkind = {"name":"sasasa"};
            await kind.collection.insertMany(kinds);
            const kind1 = await kind.findOne({"name":"Starion"}).select("_id");
            let id = kind1['id'];
            id += "a12";
            const res = await request(server)
                .put('/api/kind/' + id)
                .set('x-auth-token', token)
                .send(newkind);
            expect(res.status).toBe(400);
            expect(res.body.message).toEqual('آیدی ارسال شده نامعتبر است');
        });
        it('should return 404 if product not found', async () => {
            let token = await creatEmployeeUser();
            const kinds = [{"name":"Genesis"},
                {"name":"Starion"},
                {"name":"B-Series Plus"},
                {"name":"RAV4"},
                {"name":"Accord Crosstour"}];
            const newkind = {"name":"sasasa"};
            await kind.collection.insertMany(kinds);
            const kind1 = await kind.findOne({"name":"Starion"}).select("_id");
            let id = kind1['id'];
            await kind.findByIdAndRemove(id);
            const res = await request(server)
                .put('/api/kind/' + id)
                .set('x-auth-token', token)
                .send(newkind);
            expect(res.status).toBe(404);
            expect(res.body.message).toEqual('دسته بندی مورد نظر پیدا نشد')
        });
        it('should update kind', async () => {
            let token = await creatEmployeeUser();
            const kinds = [{"name":"Genesis"},
                {"name":"Starion"},
                {"name":"B-Series Plus"},
                {"name":"RAV4"},
                {"name":"Accord Crosstour"}];
            const newkind = {"name":"sasasa"};
            await kind.collection.insertMany(kinds);
            const kind1 = await kind.findOne({"name":"Starion"}).select("_id");
            let id = kind1['id'];
            const res = await request(server)
                .put('/api/kind/' + id)
                .set('x-auth-token', token)
                .send(newkind);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name');
        });

    });
    describe('Post /', () => {
        it('should return 401 if u are not log in', async () => {
            const newkind = {"name":"salam"};
            const res = await request(server)
                .post('/api/kind/')
                .send(newkind);
            expect(res.status).toBe(401);
            expect(res.body.message).toEqual('دسترسی شما به این قسمت محدود می باشد.')
        });
        it('should return 403 if token is invalid', async () => {
            let token = new user().generateAuthToken();
            token += "12"
            const newkind = {"name":"salam"};
            const res = await request(server)
                .post('/api/kind/')
                .set('x-auth-token', token)
                .send(newkind);
            expect(res.status).toBe(403);
            expect(res.body.message).toEqual('توکن ارسالی نامعتبر می باشد');
        });
        it('should return 403 if u are not employee', async () => {
            let token = new user().generateAuthToken();
            const newkind = {"name":"salam"};
            const res = await request(server)
                .post('/api/kind/')
                .set('x-auth-token', token)
                .send(newkind);
            expect(res.status).toBe(403);
            expect(res.body.message).toEqual('دسترسی ممنوع')
        });
        it('should return 400 if data is not valid', async () => {
            let token = await creatEmployeeUser();
            const newkind = {"name":"s"};
            const res = await request(server)
                .post('/api/kind/')
                .set('x-auth-token', token)
                .send(newkind);
            expect(res.status).toBe(400);
            expect(res.body.message).toEqual("دسته بندی نامعتبر است")
        });
        it('should update kind', async () => {
            let token = await creatEmployeeUser();
            const newkind = {"name":"salam"};
            const res = await request(server)
                .post('/api/kind/')
                .set('x-auth-token', token)
                .send(newkind);
            const foundkind = await kind.findOne({name : "salam"})
            expect(res.status).toBe(200);
            expect(foundkind).toHaveProperty('name')
            expect(res.body).toHaveProperty('name');
        });

    });



});

creatEmployeeUser = async function () {
    console.log('===========> in  creatUser <============');

    const newuser = new user({
        name: "محمد",
        family: "علائی",
        number: "09036343062",
        password: "56500600",
        isadmin: "false",
        isemployee: "true",
        userwallet: []
    });
    const saveduser= await newuser.save();

    await console.log('===========1> in  creatUser <1============' + saveduser);
    const token = await saveduser.generateAuthToken();
    await console.log('===========> in  creatUser <============' + token);


    return  token;
}