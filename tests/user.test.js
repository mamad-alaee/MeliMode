const request = require('supertest');
const {user} = require('../datamodels/userdm');
const mongoose = require('mongoose');
let server;


describe('/api/user', () => {
    beforeEach(() => { server = require('../app'); })
    afterEach(async () => {
        server.close();
        await user.remove({});
    });

    describe('GET /', () => {
        it('should return 401 if u are not log in', async () =>  {
            const users = [{"name":"Denney","family":"Angèle","email":"dscotting0@arstechnica.com","number":"822-672-8487","password":"MuYyP4","address":"8774 Larry Court","zipcode":"21695-323","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Sherlock","family":"Célestine","email":"sturnpenny1@gmail.com","number":"930-362-4662","password":"vkQmqEqs","address":"16 Browning Junction","zipcode":"43419-382","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Bryon","family":"Aimée","email":"btremoille2@shinystat.com","number":"662-419-0066","password":"87yOT3eKEPVD","address":"149 Caliangt Crossing","zipcode":"68084-040","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Sanson","family":"Göran","email":"sgiacovetti3@tinyurl.com","number":"906-372-8564","password":"eGKDO6xzI","address":"1568 Londonderry Parkway","zipcode":"59779-490","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Coleman","family":"Pò","email":"cgurys4@yahoo.com","number":"337-516-1488","password":"3X503O","address":"929 Cambridge Road","zipcode":"50876-182","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Rafaellle","family":"Mélissandre","email":"rwilderspoon5@blogger.com","number":"240-717-7074","password":"Uo2wCpK","address":"56190 Susan Alley","zipcode":"55154-9379","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Nestor","family":"Lèi","email":"neverall6@bloglovin.com","number":"686-226-6738","password":"AT8cdTZsfilB","address":"5 Red Cloud Crossing","zipcode":"62584-994","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Dominik","family":"Edmée","email":"dtaill7@mit.edu","number":"524-960-7628","password":"SHFMkHJTe","address":"49 Merry Lane","zipcode":"11822-4073","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Harper","family":"Eliès","email":"hheintzsch8@theglobeandmail.com","number":"648-681-5690","password":"O6wymj","address":"14 Spohn Junction","zipcode":"43269-824","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Reinald","family":"Véronique","email":"rpalk9@bloglovin.com","number":"412-790-3129","password":"v2CemZq7SOB","address":"2 Butternut Pass","zipcode":"30142-205","isadmin":false,"isemployee":false,"userwallet":[]}];
            await user.collection.insertMany(users);

            const res = await request(server).get('/api/user/');
            expect(res.status).toBe(401);
            expect(res.body.message).toEqual('دسترسی شما به این قسمت محدود می باشد.')
        });
        it('should return 403 if token is invalid', async () =>  {
            let token = new user().generateAuthToken();
            token += "12"
            const users = [{"name":"Denney","family":"Angèle","email":"dscotting0@arstechnica.com","number":"822-672-8487","password":"MuYyP4","address":"8774 Larry Court","zipcode":"21695-323","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Sherlock","family":"Célestine","email":"sturnpenny1@soup.io","number":"930-362-4662","password":"vkQmqEqs","address":"16 Browning Junction","zipcode":"43419-382","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Bryon","family":"Aimée","email":"btremoille2@shinystat.com","number":"662-419-0066","password":"87yOT3eKEPVD","address":"149 Caliangt Crossing","zipcode":"68084-040","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Sanson","family":"Göran","email":"sgiacovetti3@tinyurl.com","number":"906-372-8564","password":"eGKDO6xzI","address":"1568 Londonderry Parkway","zipcode":"59779-490","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Coleman","family":"Pò","email":"cgurys4@yahoo.com","number":"337-516-1488","password":"3X503O","address":"929 Cambridge Road","zipcode":"50876-182","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Rafaellle","family":"Mélissandre","email":"rwilderspoon5@blogger.com","number":"240-717-7074","password":"Uo2wCpK","address":"56190 Susan Alley","zipcode":"55154-9379","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Nestor","family":"Lèi","email":"neverall6@bloglovin.com","number":"686-226-6738","password":"AT8cdTZsfilB","address":"5 Red Cloud Crossing","zipcode":"62584-994","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Dominik","family":"Edmée","email":"dtaill7@mit.edu","number":"524-960-7628","password":"SHFMkHJTe","address":"49 Merry Lane","zipcode":"11822-4073","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Harper","family":"Eliès","email":"hheintzsch8@theglobeandmail.com","number":"648-681-5690","password":"O6wymj","address":"14 Spohn Junction","zipcode":"43269-824","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Reinald","family":"Véronique","email":"rpalk9@bloglovin.com","number":"412-790-3129","password":"v2CemZq7SOB","address":"2 Butternut Pass","zipcode":"30142-205","isadmin":false,"isemployee":false,"userwallet":[]}];
            await user.collection.insertMany(users);

            const res = await request(server)
                .get('/api/user/')
                .set('x-auth-token', token);
            expect(res.status).toBe(403);
            expect(res.body.message).toEqual('توکن ارسالی نامعتبر می باشد')
        });
        it('should return 403 if u are not employee', async () =>  {
            let token = new user().generateAuthToken();
            const users = [{"name":"Denney","family":"Angèle","email":"dscotting0@arstechnica.com","number":"822-672-8487","password":"MuYyP4","address":"8774 Larry Court","zipcode":"21695-323","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Sherlock","family":"Célestine","email":"sturnpenny1@soup.io","number":"930-362-4662","password":"vkQmqEqs","address":"16 Browning Junction","zipcode":"43419-382","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Bryon","family":"Aimée","email":"btremoille2@shinystat.com","number":"662-419-0066","password":"87yOT3eKEPVD","address":"149 Caliangt Crossing","zipcode":"68084-040","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Sanson","family":"Göran","email":"sgiacovetti3@tinyurl.com","number":"906-372-8564","password":"eGKDO6xzI","address":"1568 Londonderry Parkway","zipcode":"59779-490","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Coleman","family":"Pò","email":"cgurys4@yahoo.com","number":"337-516-1488","password":"3X503O","address":"929 Cambridge Road","zipcode":"50876-182","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Rafaellle","family":"Mélissandre","email":"rwilderspoon5@blogger.com","number":"240-717-7074","password":"Uo2wCpK","address":"56190 Susan Alley","zipcode":"55154-9379","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Nestor","family":"Lèi","email":"neverall6@bloglovin.com","number":"686-226-6738","password":"AT8cdTZsfilB","address":"5 Red Cloud Crossing","zipcode":"62584-994","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Dominik","family":"Edmée","email":"dtaill7@mit.edu","number":"524-960-7628","password":"SHFMkHJTe","address":"49 Merry Lane","zipcode":"11822-4073","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Harper","family":"Eliès","email":"hheintzsch8@theglobeandmail.com","number":"648-681-5690","password":"O6wymj","address":"14 Spohn Junction","zipcode":"43269-824","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Reinald","family":"Véronique","email":"rpalk9@bloglovin.com","number":"412-790-3129","password":"v2CemZq7SOB","address":"2 Butternut Pass","zipcode":"30142-205","isadmin":false,"isemployee":false,"userwallet":[]}];
            await user.collection.insertMany(users);

            const res = await request(server)
                .get('/api/user/')
                .set('x-auth-token', token);
            expect(res.status).toBe(403);
            expect(res.body.message).toEqual('دسترسی ممنوع')
        });
        it('should return 404 if product not found', async () =>  {
            let token = await creatAdminUser();
            const users = [{"name":"Denney","family":"Angèle","email":"dscotting0@arstechnica.com","number":"822-672-8487","password":"MuYyP4","address":"8774 Larry Court","zipcode":"21695-323","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Sherlock","family":"Célestine","email":"sturnpenny1@soup.io","number":"930-362-4662","password":"vkQmqEqs","address":"16 Browning Junction","zipcode":"43419-382","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Bryon","family":"Aimée","email":"btremoille2@shinystat.com","number":"662-419-0066","password":"87yOT3eKEPVD","address":"149 Caliangt Crossing","zipcode":"68084-040","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Sanson","family":"Göran","email":"sgiacovetti3@tinyurl.com","number":"906-372-8564","password":"eGKDO6xzI","address":"1568 Londonderry Parkway","zipcode":"59779-490","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Coleman","family":"Pò","email":"cgurys4@yahoo.com","number":"337-516-1488","password":"3X503O","address":"929 Cambridge Road","zipcode":"50876-182","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Rafaellle","family":"Mélissandre","email":"rwilderspoon5@blogger.com","number":"240-717-7074","password":"Uo2wCpK","address":"56190 Susan Alley","zipcode":"55154-9379","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Nestor","family":"Lèi","email":"neverall6@bloglovin.com","number":"686-226-6738","password":"AT8cdTZsfilB","address":"5 Red Cloud Crossing","zipcode":"62584-994","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Dominik","family":"Edmée","email":"dtaill7@mit.edu","number":"524-960-7628","password":"SHFMkHJTe","address":"49 Merry Lane","zipcode":"11822-4073","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Harper","family":"Eliès","email":"hheintzsch8@theglobeandmail.com","number":"648-681-5690","password":"O6wymj","address":"14 Spohn Junction","zipcode":"43269-824","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Reinald","family":"Véronique","email":"rpalk9@bloglovin.com","number":"412-790-3129","password":"v2CemZq7SOB","address":"2 Butternut Pass","zipcode":"30142-205","isadmin":false,"isemployee":false,"userwallet":[]}];
            await user.collection.insertMany(users);
            const user1 = await user.findOne({ name: "Reinald" }).select("_id");
            let id = user1['id'];
            await user.findByIdAndRemove(id);
            const res = await request(server)
                .get('/api/user/' + id)
                .set('x-auth-token', token);
            expect(res.status).toBe(404);
            expect(res.body.message).toEqual('کاربری با این نام کاربری وجود ندارد')
        });
        it('should return user', async () =>  {
            let token = await creatAdminUser();
            const users = [{"name":"Denney","family":"Angèle","email":"dscotting0@arstechnica.com","number":"822-672-8487","password":"MuYyP4","address":"8774 Larry Court","zipcode":"21695-323","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Sherlock","family":"Célestine","email":"sturnpenny1@soup.io","number":"930-362-4662","password":"vkQmqEqs","address":"16 Browning Junction","zipcode":"43419-382","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Bryon","family":"Aimée","email":"btremoille2@shinystat.com","number":"662-419-0066","password":"87yOT3eKEPVD","address":"149 Caliangt Crossing","zipcode":"68084-040","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Sanson","family":"Göran","email":"sgiacovetti3@tinyurl.com","number":"906-372-8564","password":"eGKDO6xzI","address":"1568 Londonderry Parkway","zipcode":"59779-490","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Coleman","family":"Pò","email":"cgurys4@yahoo.com","number":"337-516-1488","password":"3X503O","address":"929 Cambridge Road","zipcode":"50876-182","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Rafaellle","family":"Mélissandre","email":"rwilderspoon5@blogger.com","number":"240-717-7074","password":"Uo2wCpK","address":"56190 Susan Alley","zipcode":"55154-9379","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Nestor","family":"Lèi","email":"neverall6@bloglovin.com","number":"686-226-6738","password":"AT8cdTZsfilB","address":"5 Red Cloud Crossing","zipcode":"62584-994","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Dominik","family":"Edmée","email":"dtaill7@mit.edu","number":"524-960-7628","password":"SHFMkHJTe","address":"49 Merry Lane","zipcode":"11822-4073","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Harper","family":"Eliès","email":"hheintzsch8@theglobeandmail.com","number":"648-681-5690","password":"O6wymj","address":"14 Spohn Junction","zipcode":"43269-824","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Reinald","family":"Véronique","email":"rpalk9@bloglovin.com","number":"412-790-3129","password":"v2CemZq7SOB","address":"2 Butternut Pass","zipcode":"30142-205","isadmin":false,"isemployee":false,"userwallet":[]}];
            await user.collection.insertMany(users);
            const user1 = await user.findOne({ name: "Reinald" }).select("_id");
            let id = user1['id'];
            const res = await request(server)
                .get('/api/user/' + id)
                .set('x-auth-token', token);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('email');
        });
        it('should return users', async () =>  {
            let token = await creatAdminUser();
            const users = [{"name":"Denney","family":"Angèle","email":"dscotting0@arstechnica.com","number":"822-672-8487","password":"MuYyP4","address":"8774 Larry Court","zipcode":"21695-323","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Sherlock","family":"Célestine","email":"sturnpenny1@soup.io","number":"930-362-4662","password":"vkQmqEqs","address":"16 Browning Junction","zipcode":"43419-382","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Bryon","family":"Aimée","email":"btremoille2@shinystat.com","number":"662-419-0066","password":"87yOT3eKEPVD","address":"149 Caliangt Crossing","zipcode":"68084-040","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Sanson","family":"Göran","email":"sgiacovetti3@tinyurl.com","number":"906-372-8564","password":"eGKDO6xzI","address":"1568 Londonderry Parkway","zipcode":"59779-490","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Coleman","family":"Pò","email":"cgurys4@yahoo.com","number":"337-516-1488","password":"3X503O","address":"929 Cambridge Road","zipcode":"50876-182","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Rafaellle","family":"Mélissandre","email":"rwilderspoon5@blogger.com","number":"240-717-7074","password":"Uo2wCpK","address":"56190 Susan Alley","zipcode":"55154-9379","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Nestor","family":"Lèi","email":"neverall6@bloglovin.com","number":"686-226-6738","password":"AT8cdTZsfilB","address":"5 Red Cloud Crossing","zipcode":"62584-994","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Dominik","family":"Edmée","email":"dtaill7@mit.edu","number":"524-960-7628","password":"SHFMkHJTe","address":"49 Merry Lane","zipcode":"11822-4073","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Harper","family":"Eliès","email":"hheintzsch8@theglobeandmail.com","number":"648-681-5690","password":"O6wymj","address":"14 Spohn Junction","zipcode":"43269-824","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Reinald","family":"Véronique","email":"rpalk9@bloglovin.com","number":"412-790-3129","password":"v2CemZq7SOB","address":"2 Butternut Pass","zipcode":"30142-205","isadmin":false,"isemployee":false,"userwallet":[]}];
            await user.collection.insertMany(users);
            const res = await request(server)
                .get('/api/user/')
                .set('x-auth-token', token);
            expect(res.status).toBe(200);
            expect(res.body[1]).toHaveProperty('email');
        });
    });
    describe('delete /', () => {
        it('should return 401 if u are not log in', async () =>  {
            const users = [{"name":"Denney","family":"Angèle","email":"dscotting0@arstechnica.com","number":"822-672-8487","password":"MuYyP4","address":"8774 Larry Court","zipcode":"21695-323","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Sherlock","family":"Célestine","email":"sturnpenny1@soup.io","number":"930-362-4662","password":"vkQmqEqs","address":"16 Browning Junction","zipcode":"43419-382","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Bryon","family":"Aimée","email":"btremoille2@shinystat.com","number":"662-419-0066","password":"87yOT3eKEPVD","address":"149 Caliangt Crossing","zipcode":"68084-040","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Sanson","family":"Göran","email":"sgiacovetti3@tinyurl.com","number":"906-372-8564","password":"eGKDO6xzI","address":"1568 Londonderry Parkway","zipcode":"59779-490","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Coleman","family":"Pò","email":"cgurys4@yahoo.com","number":"337-516-1488","password":"3X503O","address":"929 Cambridge Road","zipcode":"50876-182","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Rafaellle","family":"Mélissandre","email":"rwilderspoon5@blogger.com","number":"240-717-7074","password":"Uo2wCpK","address":"56190 Susan Alley","zipcode":"55154-9379","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Nestor","family":"Lèi","email":"neverall6@bloglovin.com","number":"686-226-6738","password":"AT8cdTZsfilB","address":"5 Red Cloud Crossing","zipcode":"62584-994","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Dominik","family":"Edmée","email":"dtaill7@mit.edu","number":"524-960-7628","password":"SHFMkHJTe","address":"49 Merry Lane","zipcode":"11822-4073","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Harper","family":"Eliès","email":"hheintzsch8@theglobeandmail.com","number":"648-681-5690","password":"O6wymj","address":"14 Spohn Junction","zipcode":"43269-824","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Reinald","family":"Véronique","email":"rpalk9@bloglovin.com","number":"412-790-3129","password":"v2CemZq7SOB","address":"2 Butternut Pass","zipcode":"30142-205","isadmin":false,"isemployee":false,"userwallet":[]}];
            await user.collection.insertMany(users);
            const user1 = await user.findOne({ name: "Reinald" }).select("_id");
            let id = user1['id'];
            const res = await request(server).delete('/api/user/' + id);
            expect(res.status).toBe(401);
            expect(res.body.message).toEqual('دسترسی شما به این قسمت محدود می باشد.')
        });
        it('should return 403 if token is invalid', async () =>  {
            let token = new user().generateAuthToken();
            token += "12"
            const users = [{"name":"Denney","family":"Angèle","email":"dscotting0@arstechnica.com","number":"822-672-8487","password":"MuYyP4","address":"8774 Larry Court","zipcode":"21695-323","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Sherlock","family":"Célestine","email":"sturnpenny1@soup.io","number":"930-362-4662","password":"vkQmqEqs","address":"16 Browning Junction","zipcode":"43419-382","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Bryon","family":"Aimée","email":"btremoille2@shinystat.com","number":"662-419-0066","password":"87yOT3eKEPVD","address":"149 Caliangt Crossing","zipcode":"68084-040","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Sanson","family":"Göran","email":"sgiacovetti3@tinyurl.com","number":"906-372-8564","password":"eGKDO6xzI","address":"1568 Londonderry Parkway","zipcode":"59779-490","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Coleman","family":"Pò","email":"cgurys4@yahoo.com","number":"337-516-1488","password":"3X503O","address":"929 Cambridge Road","zipcode":"50876-182","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Rafaellle","family":"Mélissandre","email":"rwilderspoon5@blogger.com","number":"240-717-7074","password":"Uo2wCpK","address":"56190 Susan Alley","zipcode":"55154-9379","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Nestor","family":"Lèi","email":"neverall6@bloglovin.com","number":"686-226-6738","password":"AT8cdTZsfilB","address":"5 Red Cloud Crossing","zipcode":"62584-994","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Dominik","family":"Edmée","email":"dtaill7@mit.edu","number":"524-960-7628","password":"SHFMkHJTe","address":"49 Merry Lane","zipcode":"11822-4073","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Harper","family":"Eliès","email":"hheintzsch8@theglobeandmail.com","number":"648-681-5690","password":"O6wymj","address":"14 Spohn Junction","zipcode":"43269-824","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Reinald","family":"Véronique","email":"rpalk9@bloglovin.com","number":"412-790-3129","password":"v2CemZq7SOB","address":"2 Butternut Pass","zipcode":"30142-205","isadmin":false,"isemployee":false,"userwallet":[]}];
            await user.collection.insertMany(users);
            const user1 = await user.findOne({ name: "Reinald" }).select("_id");
            let id = user1['id'];
            const res = await request(server)
                .delete('/api/user/' + id)
                .set('x-auth-token', token);
            expect(res.status).toBe(403);
            expect(res.body.message).toEqual('توکن ارسالی نامعتبر می باشد')
        });
        it('should return 403 if u are not employee', async () =>  {
            let token = new user().generateAuthToken();
            const users = [{"name":"Denney","family":"Angèle","email":"dscotting0@arstechnica.com","number":"822-672-8487","password":"MuYyP4","address":"8774 Larry Court","zipcode":"21695-323","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Sherlock","family":"Célestine","email":"sturnpenny1@soup.io","number":"930-362-4662","password":"vkQmqEqs","address":"16 Browning Junction","zipcode":"43419-382","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Bryon","family":"Aimée","email":"btremoille2@shinystat.com","number":"662-419-0066","password":"87yOT3eKEPVD","address":"149 Caliangt Crossing","zipcode":"68084-040","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Sanson","family":"Göran","email":"sgiacovetti3@tinyurl.com","number":"906-372-8564","password":"eGKDO6xzI","address":"1568 Londonderry Parkway","zipcode":"59779-490","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Coleman","family":"Pò","email":"cgurys4@yahoo.com","number":"337-516-1488","password":"3X503O","address":"929 Cambridge Road","zipcode":"50876-182","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Rafaellle","family":"Mélissandre","email":"rwilderspoon5@blogger.com","number":"240-717-7074","password":"Uo2wCpK","address":"56190 Susan Alley","zipcode":"55154-9379","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Nestor","family":"Lèi","email":"neverall6@bloglovin.com","number":"686-226-6738","password":"AT8cdTZsfilB","address":"5 Red Cloud Crossing","zipcode":"62584-994","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Dominik","family":"Edmée","email":"dtaill7@mit.edu","number":"524-960-7628","password":"SHFMkHJTe","address":"49 Merry Lane","zipcode":"11822-4073","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Harper","family":"Eliès","email":"hheintzsch8@theglobeandmail.com","number":"648-681-5690","password":"O6wymj","address":"14 Spohn Junction","zipcode":"43269-824","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Reinald","family":"Véronique","email":"rpalk9@bloglovin.com","number":"412-790-3129","password":"v2CemZq7SOB","address":"2 Butternut Pass","zipcode":"30142-205","isadmin":false,"isemployee":false,"userwallet":[]}];
            await user.collection.insertMany(users);
            const user1 = await user.findOne({ name: "Reinald" }).select("_id");
            let id = user1['id'];
            const res = await request(server)
                .delete('/api/user/' + id)
                .set('x-auth-token', token);
            expect(res.status).toBe(403);
            expect(res.body.message).toEqual('دسترسی ممنوع');
        });
        it('should return 403 if u are employee but not admin', async () =>  {
            let token = await creatEmployeeUser();
            const users = [{"name":"Denney","family":"Angèle","email":"dscotting0@arstechnica.com","number":"822-672-8487","password":"MuYyP4","address":"8774 Larry Court","zipcode":"21695-323","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Sherlock","family":"Célestine","email":"sturnpenny1@soup.io","number":"930-362-4662","password":"vkQmqEqs","address":"16 Browning Junction","zipcode":"43419-382","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Bryon","family":"Aimée","email":"btremoille2@shinystat.com","number":"662-419-0066","password":"87yOT3eKEPVD","address":"149 Caliangt Crossing","zipcode":"68084-040","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Sanson","family":"Göran","email":"sgiacovetti3@tinyurl.com","number":"906-372-8564","password":"eGKDO6xzI","address":"1568 Londonderry Parkway","zipcode":"59779-490","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Coleman","family":"Pò","email":"cgurys4@yahoo.com","number":"337-516-1488","password":"3X503O","address":"929 Cambridge Road","zipcode":"50876-182","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Rafaellle","family":"Mélissandre","email":"rwilderspoon5@blogger.com","number":"240-717-7074","password":"Uo2wCpK","address":"56190 Susan Alley","zipcode":"55154-9379","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Nestor","family":"Lèi","email":"neverall6@bloglovin.com","number":"686-226-6738","password":"AT8cdTZsfilB","address":"5 Red Cloud Crossing","zipcode":"62584-994","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Dominik","family":"Edmée","email":"dtaill7@mit.edu","number":"524-960-7628","password":"SHFMkHJTe","address":"49 Merry Lane","zipcode":"11822-4073","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Harper","family":"Eliès","email":"hheintzsch8@theglobeandmail.com","number":"648-681-5690","password":"O6wymj","address":"14 Spohn Junction","zipcode":"43269-824","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Reinald","family":"Véronique","email":"rpalk9@bloglovin.com","number":"412-790-3129","password":"v2CemZq7SOB","address":"2 Butternut Pass","zipcode":"30142-205","isadmin":false,"isemployee":false,"userwallet":[]}];
            await user.collection.insertMany(users);
            const user1 = await user.findOne({ name: "Reinald" }).select("_id");
            let id = user1['id'];
            const res = await request(server)
                .delete('/api/user/' + id)
                .set('x-auth-token', token);
            expect(res.status).toBe(403);
            expect(res.body.message).toEqual('دسترسی ممنوع');
        });
        it('should return 404 if product not found', async () =>  {
            let token = await creatAdminUser();
            const users = [{"name":"Denney","family":"Angèle","email":"dscotting0@arstechnica.com","number":"822-672-8487","password":"MuYyP4","address":"8774 Larry Court","zipcode":"21695-323","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Sherlock","family":"Célestine","email":"sturnpenny1@soup.io","number":"930-362-4662","password":"vkQmqEqs","address":"16 Browning Junction","zipcode":"43419-382","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Bryon","family":"Aimée","email":"btremoille2@shinystat.com","number":"662-419-0066","password":"87yOT3eKEPVD","address":"149 Caliangt Crossing","zipcode":"68084-040","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Sanson","family":"Göran","email":"sgiacovetti3@tinyurl.com","number":"906-372-8564","password":"eGKDO6xzI","address":"1568 Londonderry Parkway","zipcode":"59779-490","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Coleman","family":"Pò","email":"cgurys4@yahoo.com","number":"337-516-1488","password":"3X503O","address":"929 Cambridge Road","zipcode":"50876-182","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Rafaellle","family":"Mélissandre","email":"rwilderspoon5@blogger.com","number":"240-717-7074","password":"Uo2wCpK","address":"56190 Susan Alley","zipcode":"55154-9379","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Nestor","family":"Lèi","email":"neverall6@bloglovin.com","number":"686-226-6738","password":"AT8cdTZsfilB","address":"5 Red Cloud Crossing","zipcode":"62584-994","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Dominik","family":"Edmée","email":"dtaill7@mit.edu","number":"524-960-7628","password":"SHFMkHJTe","address":"49 Merry Lane","zipcode":"11822-4073","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Harper","family":"Eliès","email":"hheintzsch8@theglobeandmail.com","number":"648-681-5690","password":"O6wymj","address":"14 Spohn Junction","zipcode":"43269-824","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Reinald","family":"Véronique","email":"rpalk9@bloglovin.com","number":"412-790-3129","password":"v2CemZq7SOB","address":"2 Butternut Pass","zipcode":"30142-205","isadmin":false,"isemployee":false,"userwallet":[]}];
            await user.collection.insertMany(users);
            const user1 = await user.findOne({ name: "Reinald" }).select("_id");
            let id = user1['id'];
            await user.findByIdAndRemove(id);
            const res = await request(server)
                .delete('/api/user/' + id)
                .set('x-auth-token', token);
            expect(res.status).toBe(404);
            expect(res.body.message).toEqual('کاربری با این نام کاربری وجود ندارد')
        });
        it('should delete user', async () =>  {
            let token = await creatAdminUser();
            const users = [{"name":"Denney","family":"Angèle","email":"dscotting0@arstechnica.com","number":"822-672-8487","password":"MuYyP4","address":"8774 Larry Court","zipcode":"21695-323","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Sherlock","family":"Célestine","email":"sturnpenny1@soup.io","number":"930-362-4662","password":"vkQmqEqs","address":"16 Browning Junction","zipcode":"43419-382","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Bryon","family":"Aimée","email":"btremoille2@shinystat.com","number":"662-419-0066","password":"87yOT3eKEPVD","address":"149 Caliangt Crossing","zipcode":"68084-040","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Sanson","family":"Göran","email":"sgiacovetti3@tinyurl.com","number":"906-372-8564","password":"eGKDO6xzI","address":"1568 Londonderry Parkway","zipcode":"59779-490","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Coleman","family":"Pò","email":"cgurys4@yahoo.com","number":"337-516-1488","password":"3X503O","address":"929 Cambridge Road","zipcode":"50876-182","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Rafaellle","family":"Mélissandre","email":"rwilderspoon5@blogger.com","number":"240-717-7074","password":"Uo2wCpK","address":"56190 Susan Alley","zipcode":"55154-9379","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Nestor","family":"Lèi","email":"neverall6@bloglovin.com","number":"686-226-6738","password":"AT8cdTZsfilB","address":"5 Red Cloud Crossing","zipcode":"62584-994","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Dominik","family":"Edmée","email":"dtaill7@mit.edu","number":"524-960-7628","password":"SHFMkHJTe","address":"49 Merry Lane","zipcode":"11822-4073","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Harper","family":"Eliès","email":"hheintzsch8@theglobeandmail.com","number":"648-681-5690","password":"O6wymj","address":"14 Spohn Junction","zipcode":"43269-824","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Reinald","family":"Véronique","email":"rpalk9@bloglovin.com","number":"412-790-3129","password":"v2CemZq7SOB","address":"2 Butternut Pass","zipcode":"30142-205","isadmin":false,"isemployee":false,"userwallet":[]}];
            await user.collection.insertMany(users);
            const user1 = await user.findOne({ name: "Reinald" }).select("_id");
            let id = user1['id'];
            const res = await request(server)
                .delete('/api/user/' + id)
                .set('x-auth-token', token);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('email');
        });
    });
    describe('put /', () => {
        it('should return 401 if u are not log in', async () =>  {
            const users = [{"name":"Denney","family":"Angèle","email":"dscotting0@arstechnica.com","number":"822-672-8487","password":"MuYyP4","address":"8774 Larry Court","zipcode":"21695-323","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Sherlock","family":"Célestine","email":"sturnpenny1@soup.io","number":"930-362-4662","password":"vkQmqEqs","address":"16 Browning Junction","zipcode":"43419-382","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Bryon","family":"Aimée","email":"btremoille2@shinystat.com","number":"662-419-0066","password":"87yOT3eKEPVD","address":"149 Caliangt Crossing","zipcode":"68084-040","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Sanson","family":"Göran","email":"sgiacovetti3@tinyurl.com","number":"906-372-8564","password":"eGKDO6xzI","address":"1568 Londonderry Parkway","zipcode":"59779-490","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Coleman","family":"Pò","email":"cgurys4@yahoo.com","number":"337-516-1488","password":"3X503O","address":"929 Cambridge Road","zipcode":"50876-182","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Rafaellle","family":"Mélissandre","email":"rwilderspoon5@blogger.com","number":"240-717-7074","password":"Uo2wCpK","address":"56190 Susan Alley","zipcode":"55154-9379","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Nestor","family":"Lèi","email":"neverall6@bloglovin.com","number":"686-226-6738","password":"AT8cdTZsfilB","address":"5 Red Cloud Crossing","zipcode":"62584-994","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Dominik","family":"Edmée","email":"dtaill7@mit.edu","number":"524-960-7628","password":"SHFMkHJTe","address":"49 Merry Lane","zipcode":"11822-4073","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Harper","family":"Eliès","email":"hheintzsch8@theglobeandmail.com","number":"648-681-5690","password":"O6wymj","address":"14 Spohn Junction","zipcode":"43269-824","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Reinald","family":"Véronique","email":"rpalk9@bloglovin.com","number":"412-790-3129","password":"v2CemZq7SOB","address":"2 Butternut Pass","zipcode":"30142-205","isadmin":false,"isemployee":false,"userwallet":[]}];
            await user.collection.insertMany(users);
            const user1 = await user.findOne({ name: "Reinald" }).select("_id");
            let id = user1['id'];
            const res = await request(server).put('/api/user/' + id);
            expect(res.status).toBe(401);
            expect(res.body.message).toEqual('دسترسی شما به این قسمت محدود می باشد.')
        });
        it('should return 403 if token is invalid', async () =>  {
            let token = new user().generateAuthToken();
            token += "12"
            const users = [{"name":"Denney","family":"Angèle","email":"dscotting0@arstechnica.com","number":"822-672-8487","password":"MuYyP4","address":"8774 Larry Court","zipcode":"21695-323","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Sherlock","family":"Célestine","email":"sturnpenny1@soup.io","number":"930-362-4662","password":"vkQmqEqs","address":"16 Browning Junction","zipcode":"43419-382","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Bryon","family":"Aimée","email":"btremoille2@shinystat.com","number":"662-419-0066","password":"87yOT3eKEPVD","address":"149 Caliangt Crossing","zipcode":"68084-040","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Sanson","family":"Göran","email":"sgiacovetti3@tinyurl.com","number":"906-372-8564","password":"eGKDO6xzI","address":"1568 Londonderry Parkway","zipcode":"59779-490","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Coleman","family":"Pò","email":"cgurys4@yahoo.com","number":"337-516-1488","password":"3X503O","address":"929 Cambridge Road","zipcode":"50876-182","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Rafaellle","family":"Mélissandre","email":"rwilderspoon5@blogger.com","number":"240-717-7074","password":"Uo2wCpK","address":"56190 Susan Alley","zipcode":"55154-9379","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Nestor","family":"Lèi","email":"neverall6@bloglovin.com","number":"686-226-6738","password":"AT8cdTZsfilB","address":"5 Red Cloud Crossing","zipcode":"62584-994","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Dominik","family":"Edmée","email":"dtaill7@mit.edu","number":"524-960-7628","password":"SHFMkHJTe","address":"49 Merry Lane","zipcode":"11822-4073","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Harper","family":"Eliès","email":"hheintzsch8@theglobeandmail.com","number":"648-681-5690","password":"O6wymj","address":"14 Spohn Junction","zipcode":"43269-824","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Reinald","family":"Véronique","email":"rpalk9@bloglovin.com","number":"412-790-3129","password":"v2CemZq7SOB","address":"2 Butternut Pass","zipcode":"30142-205","isadmin":false,"isemployee":false,"userwallet":[]}];
            await user.collection.insertMany(users);
            const user1 = await user.findOne({ name: "Reinald" }).select("_id");
            let id = user1['id'];
            const res = await request(server)
                .put('/api/user/' + id)
                .set('x-auth-token', token);
            expect(res.status).toBe(403);
            expect(res.body.message).toEqual('توکن ارسالی نامعتبر می باشد')
        });
        it('should return 404 if data is not valid', async () =>  {
            let token = await creatAdminUser();
            const newuser = {"name":"s","family":"Célestine","email":"sturnpenny1@soup.io","number":"930-362-4662","password":"vkQmqEqs","address":"16 Browning Junction","zipcode":"43419-382","isadmin":false,"isemployee":false,"userwallet":[]};
            const users = [{"name":"Denney","family":"Angèle","email":"dscotting0@arstechnica.com","number":"822-672-8487","password":"MuYyP4","address":"8774 Larry Court","zipcode":"21695-323","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Sherlock","family":"Célestine","email":"sturnpenny1@soup.io","number":"930-362-4662","password":"vkQmqEqs","address":"16 Browning Junction","zipcode":"43419-382","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Bryon","family":"Aimée","email":"btremoille2@shinystat.com","number":"662-419-0066","password":"87yOT3eKEPVD","address":"149 Caliangt Crossing","zipcode":"68084-040","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Sanson","family":"Göran","email":"sgiacovetti3@tinyurl.com","number":"906-372-8564","password":"eGKDO6xzI","address":"1568 Londonderry Parkway","zipcode":"59779-490","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Coleman","family":"Pò","email":"cgurys4@yahoo.com","number":"337-516-1488","password":"3X503O","address":"929 Cambridge Road","zipcode":"50876-182","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Rafaellle","family":"Mélissandre","email":"rwilderspoon5@blogger.com","number":"240-717-7074","password":"Uo2wCpK","address":"56190 Susan Alley","zipcode":"55154-9379","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Nestor","family":"Lèi","email":"neverall6@bloglovin.com","number":"686-226-6738","password":"AT8cdTZsfilB","address":"5 Red Cloud Crossing","zipcode":"62584-994","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Dominik","family":"Edmée","email":"dtaill7@mit.edu","number":"524-960-7628","password":"SHFMkHJTe","address":"49 Merry Lane","zipcode":"11822-4073","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Harper","family":"Eliès","email":"hheintzsch8@theglobeandmail.com","number":"648-681-5690","password":"O6wymj","address":"14 Spohn Junction","zipcode":"43269-824","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Reinald","family":"Véronique","email":"rpalk9@bloglovin.com","number":"412-790-3129","password":"v2CemZq7SOB","address":"2 Butternut Pass","zipcode":"30142-205","isadmin":false,"isemployee":false,"userwallet":[]}];
            await user.collection.insertMany(users);
            const user1 = await user.findOne({ name: "Reinald" }).select("_id");
            let id = user1['id'];
            // await user.findByIdAndRemove(id);
            const res = await request(server)
                .put('/api/user/' + id)
                .set('x-auth-token', token)
                .send(newuser);
            expect(res.status).toBe(400);
            expect(res.body.message).toEqual("اطلاعات نامعتبر است.")
        });
        it('should return 404 if user not found', async () =>  {
            let token = await creatAdminUser();
            const newuser = {"name":"salam",
                "family":"Célestine",
                "email":"sturnpenny1@soup.io",
                "number":"09036343062",
                "password":"vkQmqE345qs",
                "address":"16 Browning Junction",
                "zipcode":"1234567891",
                "isadmin":false,
                "isemployee":false,
                "userwallet":[]};
            const users = [{"name":"Denney","family":"Angèle","email":"dscotting0@arstechnica.com","number":"822-672-8487","password":"MuYyP4","address":"8774 Larry Court","zipcode":"21695-323","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Sherlock","family":"Célestine","email":"sturnpenny1@soup.io","number":"930-362-4662","password":"vkQmqEqs","address":"16 Browning Junction","zipcode":"43419-382","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Bryon","family":"Aimée","email":"btremoille2@shinystat.com","number":"662-419-0066","password":"87yOT3eKEPVD","address":"149 Caliangt Crossing","zipcode":"68084-040","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Sanson","family":"Göran","email":"sgiacovetti3@tinyurl.com","number":"906-372-8564","password":"eGKDO6xzI","address":"1568 Londonderry Parkway","zipcode":"59779-490","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Coleman","family":"Pò","email":"cgurys4@yahoo.com","number":"337-516-1488","password":"3X503O","address":"929 Cambridge Road","zipcode":"50876-182","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Rafaellle","family":"Mélissandre","email":"rwilderspoon5@blogger.com","number":"240-717-7074","password":"Uo2wCpK","address":"56190 Susan Alley","zipcode":"55154-9379","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Nestor","family":"Lèi","email":"neverall6@bloglovin.com","number":"686-226-6738","password":"AT8cdTZsfilB","address":"5 Red Cloud Crossing","zipcode":"62584-994","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Dominik","family":"Edmée","email":"dtaill7@mit.edu","number":"524-960-7628","password":"SHFMkHJTe","address":"49 Merry Lane","zipcode":"11822-4073","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Harper","family":"Eliès","email":"hheintzsch8@theglobeandmail.com","number":"648-681-5690","password":"O6wymj","address":"14 Spohn Junction","zipcode":"43269-824","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Reinald","family":"Véronique","email":"rpalk9@bloglovin.com","number":"412-790-3129","password":"v2CemZq7SOB","address":"2 Butternut Pass","zipcode":"30142-205","isadmin":false,"isemployee":false,"userwallet":[]}];
            await user.collection.insertMany(users);
            const user1 = await user.findOne({ name: "Reinald" }).select("_id");
            let id = user1['id'];
            await user.findByIdAndRemove(id);
            const res = await request(server)
                .put('/api/user/' + id)
                .set('x-auth-token', token)
                .send(newuser);
            expect(res.status).toBe(404);
            expect(res.body.message).toEqual('کاربری با این نام کاربری وجود ندارد')
        });
        it('should update user', async () =>  {
            let token = await creatAdminUser();
            const newuser = {"name":"salam",
                "family":"Célestine",
                "email":"sturnpenny1@gmail.com",
                "number":"09046343062",
                "password":"vkQmqE345qs",
                "address":"16 Browning Junction",
                "zipcode":"1234567891",
                "isadmin":false,
                "isemployee":false,
                "userwallet":["621ac149fc13ae4f99000000"]};
            const users = [{"name":"Denney","family":"Angèle","email":"dscotting0@arstechnica.com","number":"822-672-8487","password":"MuYyP4","address":"8774 Larry Court","zipcode":"21695-323","isadmin":false,"isemployee":false,"userwallet":["621ac149fc13ae4f99000000"]},
                {"name":"Sherlock","family":"Célestine","email":"sturnpenny1@gmail.io","number":"930-362-4662","password":"vkQmqEqs","address":"16 Browning Junction","zipcode":"43419-382","isadmin":false,"isemployee":false,"userwallet":["621ac149fc13ae4f99000000"]},
                {"name":"Bryon","family":"Aimée","email":"btremoille2@shinystat.com","number":"662-419-0066","password":"87yOT3eKEPVD","address":"149 Caliangt Crossing","zipcode":"68084-040","isadmin":false,"isemployee":false,"userwallet":["621ac149fc13ae4f99000000"]},
                {"name":"Sanson","family":"Göran","email":"sgiacovetti3@tinyurl.com","number":"906-372-8564","password":"eGKDO6xzI","address":"1568 Londonderry Parkway","zipcode":"59779-490","isadmin":false,"isemployee":false,"userwallet":["621ac149fc13ae4f99000000"]},
                {"name":"Coleman","family":"Pò","email":"cgurys4@yahoo.com","number":"337-516-1488","password":"3X503O","address":"929 Cambridge Road","zipcode":"50876-182","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Rafaellle","family":"Mélissandre","email":"rwilderspoon5@blogger.com","number":"240-717-7074","password":"Uo2wCpK","address":"56190 Susan Alley","zipcode":"55154-9379","isadmin":false,"isemployee":false,"userwallet":["621ac149fc13ae4f99000000"]},
                {"name":"Nestor","family":"Lèi","email":"neverall6@bloglovin.com","number":"686-226-6738","password":"AT8cdTZsfilB","address":"5 Red Cloud Crossing","zipcode":"62584-994","isadmin":false,"isemployee":false,"userwallet":["621ac149fc13ae4f99000000"]},
                {"name":"Dominik","family":"Edmée","email":"dtaill7@mit.edu","number":"524-960-7628","password":"SHFMkHJTe","address":"49 Merry Lane","zipcode":"11822-4073","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Harper","family":"Eliès","email":"hheintzsch8@theglobeandmail.com","number":"648-681-5690","password":"O6wymj","address":"14 Spohn Junction","zipcode":"43269-824","isadmin":false,"isemployee":false,"userwallet":["621ac149fc13ae4f99000000"]},
                {"name":"Reinald","family":"Véronique","email":"rpalk9@bloglovin.com","number":"412-790-3129","password":"v2CemZq7SOB","address":"2 Butternut Pass","zipcode":"30142-205","isadmin":false,"isemployee":false,"userwallet":["621ac149fc13ae4f99000000"]}];
            await user.collection.insertMany(users);
            const user1 = await user.findOne({ name: "Sherlock" }).select("_id");
            let id = user1['id'];
            const res = await request(server)
                .put('/api/user/' + id)
                .set('x-auth-token', token)
                .send(newuser);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('email')
        });


    });
    describe('put / admin /', () => {
        it('should return 401 if u are not log in', async () =>  {
            const users = [{"name":"Denney","family":"Angèle","email":"dscotting0@arstechnica.com","number":"822-672-8487","password":"MuYyP4","address":"8774 Larry Court","zipcode":"21695-323","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Sherlock","family":"Célestine","email":"sturnpenny1@soup.io","number":"930-362-4662","password":"vkQmqEqs","address":"16 Browning Junction","zipcode":"43419-382","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Bryon","family":"Aimée","email":"btremoille2@shinystat.com","number":"662-419-0066","password":"87yOT3eKEPVD","address":"149 Caliangt Crossing","zipcode":"68084-040","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Sanson","family":"Göran","email":"sgiacovetti3@tinyurl.com","number":"906-372-8564","password":"eGKDO6xzI","address":"1568 Londonderry Parkway","zipcode":"59779-490","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Coleman","family":"Pò","email":"cgurys4@yahoo.com","number":"337-516-1488","password":"3X503O","address":"929 Cambridge Road","zipcode":"50876-182","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Rafaellle","family":"Mélissandre","email":"rwilderspoon5@blogger.com","number":"240-717-7074","password":"Uo2wCpK","address":"56190 Susan Alley","zipcode":"55154-9379","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Nestor","family":"Lèi","email":"neverall6@bloglovin.com","number":"686-226-6738","password":"AT8cdTZsfilB","address":"5 Red Cloud Crossing","zipcode":"62584-994","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Dominik","family":"Edmée","email":"dtaill7@mit.edu","number":"524-960-7628","password":"SHFMkHJTe","address":"49 Merry Lane","zipcode":"11822-4073","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Harper","family":"Eliès","email":"hheintzsch8@theglobeandmail.com","number":"648-681-5690","password":"O6wymj","address":"14 Spohn Junction","zipcode":"43269-824","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Reinald","family":"Véronique","email":"rpalk9@bloglovin.com","number":"412-790-3129","password":"v2CemZq7SOB","address":"2 Butternut Pass","zipcode":"30142-205","isadmin":false,"isemployee":false,"userwallet":[]}];
            await user.collection.insertMany(users);
            const user1 = await user.findOne({ name: "Reinald" }).select("_id");
            let id = user1['id'];
            const res = await request(server).put('/api/user/admin/' + id);
            expect(res.status).toBe(401);
            expect(res.body.message).toEqual('دسترسی شما به این قسمت محدود می باشد.')
        });
        it('should return 403 if token is invalid', async () =>  {
            let token = new user().generateAuthToken();
            token += "12"
            const users = [{"name":"Denney","family":"Angèle","email":"dscotting0@arstechnica.com","number":"822-672-8487","password":"MuYyP4","address":"8774 Larry Court","zipcode":"21695-323","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Sherlock","family":"Célestine","email":"sturnpenny1@soup.io","number":"930-362-4662","password":"vkQmqEqs","address":"16 Browning Junction","zipcode":"43419-382","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Bryon","family":"Aimée","email":"btremoille2@shinystat.com","number":"662-419-0066","password":"87yOT3eKEPVD","address":"149 Caliangt Crossing","zipcode":"68084-040","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Sanson","family":"Göran","email":"sgiacovetti3@tinyurl.com","number":"906-372-8564","password":"eGKDO6xzI","address":"1568 Londonderry Parkway","zipcode":"59779-490","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Coleman","family":"Pò","email":"cgurys4@yahoo.com","number":"337-516-1488","password":"3X503O","address":"929 Cambridge Road","zipcode":"50876-182","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Rafaellle","family":"Mélissandre","email":"rwilderspoon5@blogger.com","number":"240-717-7074","password":"Uo2wCpK","address":"56190 Susan Alley","zipcode":"55154-9379","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Nestor","family":"Lèi","email":"neverall6@bloglovin.com","number":"686-226-6738","password":"AT8cdTZsfilB","address":"5 Red Cloud Crossing","zipcode":"62584-994","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Dominik","family":"Edmée","email":"dtaill7@mit.edu","number":"524-960-7628","password":"SHFMkHJTe","address":"49 Merry Lane","zipcode":"11822-4073","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Harper","family":"Eliès","email":"hheintzsch8@theglobeandmail.com","number":"648-681-5690","password":"O6wymj","address":"14 Spohn Junction","zipcode":"43269-824","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Reinald","family":"Véronique","email":"rpalk9@bloglovin.com","number":"412-790-3129","password":"v2CemZq7SOB","address":"2 Butternut Pass","zipcode":"30142-205","isadmin":false,"isemployee":false,"userwallet":[]}];
            await user.collection.insertMany(users);
            const user1 = await user.findOne({ name: "Reinald" }).select("_id");
            let id = user1['id'];
            const res = await request(server)
                .put('/api/user/admin/' + id)
                .set('x-auth-token', token);
            expect(res.status).toBe(403);
            expect(res.body.message).toEqual('توکن ارسالی نامعتبر می باشد')
        });
        it('should return 403 if u are not employee', async () =>  {
            let token = new user().generateAuthToken();
            const users = [{"name":"Denney","family":"Angèle","email":"dscotting0@arstechnica.com","number":"822-672-8487","password":"MuYyP4","address":"8774 Larry Court","zipcode":"21695-323","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Sherlock","family":"Célestine","email":"sturnpenny1@soup.io","number":"930-362-4662","password":"vkQmqEqs","address":"16 Browning Junction","zipcode":"43419-382","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Bryon","family":"Aimée","email":"btremoille2@shinystat.com","number":"662-419-0066","password":"87yOT3eKEPVD","address":"149 Caliangt Crossing","zipcode":"68084-040","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Sanson","family":"Göran","email":"sgiacovetti3@tinyurl.com","number":"906-372-8564","password":"eGKDO6xzI","address":"1568 Londonderry Parkway","zipcode":"59779-490","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Coleman","family":"Pò","email":"cgurys4@yahoo.com","number":"337-516-1488","password":"3X503O","address":"929 Cambridge Road","zipcode":"50876-182","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Rafaellle","family":"Mélissandre","email":"rwilderspoon5@blogger.com","number":"240-717-7074","password":"Uo2wCpK","address":"56190 Susan Alley","zipcode":"55154-9379","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Nestor","family":"Lèi","email":"neverall6@bloglovin.com","number":"686-226-6738","password":"AT8cdTZsfilB","address":"5 Red Cloud Crossing","zipcode":"62584-994","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Dominik","family":"Edmée","email":"dtaill7@mit.edu","number":"524-960-7628","password":"SHFMkHJTe","address":"49 Merry Lane","zipcode":"11822-4073","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Harper","family":"Eliès","email":"hheintzsch8@theglobeandmail.com","number":"648-681-5690","password":"O6wymj","address":"14 Spohn Junction","zipcode":"43269-824","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Reinald","family":"Véronique","email":"rpalk9@bloglovin.com","number":"412-790-3129","password":"v2CemZq7SOB","address":"2 Butternut Pass","zipcode":"30142-205","isadmin":false,"isemployee":false,"userwallet":[]}];
            await user.collection.insertMany(users);
            const user1 = await user.findOne({ name: "Reinald" }).select("_id");
            let id = user1['id'];
            const res = await request(server)
                .put('/api/user/admin/' + id)
                .set('x-auth-token', token);
            expect(res.status).toBe(403);
            expect(res.body.message).toEqual('دسترسی ممنوع');
        });
        it('should return 403 if u are employee but not admin', async () =>  {
            let token = await creatEmployeeUser();
            const users = [{"name":"Denney","family":"Angèle","email":"dscotting0@arstechnica.com","number":"822-672-8487","password":"MuYyP4","address":"8774 Larry Court","zipcode":"21695-323","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Sherlock","family":"Célestine","email":"sturnpenny1@soup.io","number":"930-362-4662","password":"vkQmqEqs","address":"16 Browning Junction","zipcode":"43419-382","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Bryon","family":"Aimée","email":"btremoille2@shinystat.com","number":"662-419-0066","password":"87yOT3eKEPVD","address":"149 Caliangt Crossing","zipcode":"68084-040","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Sanson","family":"Göran","email":"sgiacovetti3@tinyurl.com","number":"906-372-8564","password":"eGKDO6xzI","address":"1568 Londonderry Parkway","zipcode":"59779-490","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Coleman","family":"Pò","email":"cgurys4@yahoo.com","number":"337-516-1488","password":"3X503O","address":"929 Cambridge Road","zipcode":"50876-182","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Rafaellle","family":"Mélissandre","email":"rwilderspoon5@blogger.com","number":"240-717-7074","password":"Uo2wCpK","address":"56190 Susan Alley","zipcode":"55154-9379","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Nestor","family":"Lèi","email":"neverall6@bloglovin.com","number":"686-226-6738","password":"AT8cdTZsfilB","address":"5 Red Cloud Crossing","zipcode":"62584-994","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Dominik","family":"Edmée","email":"dtaill7@mit.edu","number":"524-960-7628","password":"SHFMkHJTe","address":"49 Merry Lane","zipcode":"11822-4073","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Harper","family":"Eliès","email":"hheintzsch8@theglobeandmail.com","number":"648-681-5690","password":"O6wymj","address":"14 Spohn Junction","zipcode":"43269-824","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Reinald","family":"Véronique","email":"rpalk9@bloglovin.com","number":"412-790-3129","password":"v2CemZq7SOB","address":"2 Butternut Pass","zipcode":"30142-205","isadmin":false,"isemployee":false,"userwallet":[]}];
            await user.collection.insertMany(users);
            const user1 = await user.findOne({ name: "Reinald" }).select("_id");
            let id = user1['id'];
            const res = await request(server)
                .put('/api/user/admin/' + id)
                .set('x-auth-token', token);
            expect(res.status).toBe(403);
            expect(res.body.message).toEqual('دسترسی ممنوع');
        });
        it('should return 400 if data is not valid', async () =>  {
            let token = await creatAdminUser();
            const newuser = {"name":"s","family":"Célestine","email":"sturnpenny1@soup.io","number":"930-362-4662","password":"vkQmqEqs","address":"16 Browning Junction","zipcode":"43419-382","isadmin":false,"isemployee":false,"userwallet":[]};
            const users = [{"name":"Denney","family":"Angèle","email":"dscotting0@arstechnica.com","number":"822-672-8487","password":"MuYyP4","address":"8774 Larry Court","zipcode":"21695-323","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Sherlock","family":"Célestine","email":"sturnpenny1@soup.io","number":"930-362-4662","password":"vkQmqEqs","address":"16 Browning Junction","zipcode":"43419-382","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Bryon","family":"Aimée","email":"btremoille2@shinystat.com","number":"662-419-0066","password":"87yOT3eKEPVD","address":"149 Caliangt Crossing","zipcode":"68084-040","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Sanson","family":"Göran","email":"sgiacovetti3@tinyurl.com","number":"906-372-8564","password":"eGKDO6xzI","address":"1568 Londonderry Parkway","zipcode":"59779-490","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Coleman","family":"Pò","email":"cgurys4@yahoo.com","number":"337-516-1488","password":"3X503O","address":"929 Cambridge Road","zipcode":"50876-182","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Rafaellle","family":"Mélissandre","email":"rwilderspoon5@blogger.com","number":"240-717-7074","password":"Uo2wCpK","address":"56190 Susan Alley","zipcode":"55154-9379","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Nestor","family":"Lèi","email":"neverall6@bloglovin.com","number":"686-226-6738","password":"AT8cdTZsfilB","address":"5 Red Cloud Crossing","zipcode":"62584-994","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Dominik","family":"Edmée","email":"dtaill7@mit.edu","number":"524-960-7628","password":"SHFMkHJTe","address":"49 Merry Lane","zipcode":"11822-4073","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Harper","family":"Eliès","email":"hheintzsch8@theglobeandmail.com","number":"648-681-5690","password":"O6wymj","address":"14 Spohn Junction","zipcode":"43269-824","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Reinald","family":"Véronique","email":"rpalk9@bloglovin.com","number":"412-790-3129","password":"v2CemZq7SOB","address":"2 Butternut Pass","zipcode":"30142-205","isadmin":false,"isemployee":false,"userwallet":[]}];
            await user.collection.insertMany(users);
            const user1 = await user.findOne({ name: "Reinald" }).select("_id");
            let id = user1['id'];
            // await user.findByIdAndRemove(id);
            const res = await request(server)
                .put('/api/user/admin/' + id)
                .set('x-auth-token', token)
                .send(newuser);
            expect(res.status).toBe(400);
            expect(res.body.message).toEqual("اطلاعات نامعتبر است.")
        });
        it('should return 404 if user not found', async () =>  {
            let token = await creatAdminUser();
            const newuser = {"name":"salam",
                "family":"Célestine",
                "email":"sturnpenny1@gmail.com",
                "number":"09036343062",
                "password":"vkQmqE345qs",
                "address":"16 Browning Junction",
                "zipcode":"1234567891",
                "isadmin":false,
                "isemployee":false,
                "userwallet":[]};
            const users = [{"name":"Denney","family":"Angèle","email":"dscotting0@arstechnica.com","number":"822-672-8487","password":"MuYyP4","address":"8774 Larry Court","zipcode":"21695-323","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Sherlock","family":"Célestine","email":"sturnpenny1@soup.io","number":"930-362-4662","password":"vkQmqEqs","address":"16 Browning Junction","zipcode":"43419-382","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Bryon","family":"Aimée","email":"btremoille2@shinystat.com","number":"662-419-0066","password":"87yOT3eKEPVD","address":"149 Caliangt Crossing","zipcode":"68084-040","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Sanson","family":"Göran","email":"sgiacovetti3@tinyurl.com","number":"906-372-8564","password":"eGKDO6xzI","address":"1568 Londonderry Parkway","zipcode":"59779-490","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Coleman","family":"Pò","email":"cgurys4@yahoo.com","number":"337-516-1488","password":"3X503O","address":"929 Cambridge Road","zipcode":"50876-182","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Rafaellle","family":"Mélissandre","email":"rwilderspoon5@blogger.com","number":"240-717-7074","password":"Uo2wCpK","address":"56190 Susan Alley","zipcode":"55154-9379","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Nestor","family":"Lèi","email":"neverall6@bloglovin.com","number":"686-226-6738","password":"AT8cdTZsfilB","address":"5 Red Cloud Crossing","zipcode":"62584-994","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Dominik","family":"Edmée","email":"dtaill7@mit.edu","number":"524-960-7628","password":"SHFMkHJTe","address":"49 Merry Lane","zipcode":"11822-4073","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Harper","family":"Eliès","email":"hheintzsch8@theglobeandmail.com","number":"648-681-5690","password":"O6wymj","address":"14 Spohn Junction","zipcode":"43269-824","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Reinald","family":"Véronique","email":"rpalk9@bloglovin.com","number":"412-790-3129","password":"v2CemZq7SOB","address":"2 Butternut Pass","zipcode":"30142-205","isadmin":false,"isemployee":false,"userwallet":[]}];
            await user.collection.insertMany(users);
            const user1 = await user.findOne({ name: "Reinald" }).select("_id");
            let id = user1['id'];
            await user.findByIdAndRemove(id);
            const res = await request(server)
                .put('/api/user/admin/' + id)
                .set('x-auth-token', token)
                .send(newuser);
            expect(res.status).toBe(404);
            expect(res.body.message).toEqual('کاربری با این نام کاربری وجود ندارد')
        });
        it('should update user', async () =>  {
            let token = await creatAdminUser();
            const newuser = {"name":"salam",
                "family":"Célestine",
                "email":"sturnpenny1@gmail.com",
                "number":"09046343062",
                "password":"vkQmqE345qs",
                "address":"16 Browning Junction",
                "zipcode":"1234567891",
                "isadmin":false,
                "isemployee":false,
                "userwallet":["621ac149fc13ae4f99000000"]};
            const users = [{"name":"Denney","family":"Angèle","email":"dscotting0@arstechnica.com","number":"822-672-8487","password":"MuYyP4","address":"8774 Larry Court","zipcode":"21695-323","isadmin":false,"isemployee":false,"userwallet":["621ac149fc13ae4f99000000"]},
                {"name":"Sherlock","family":"Célestine","email":"sturnpenny1@gmail.io","number":"930-362-4662","password":"vkQmqEqs","address":"16 Browning Junction","zipcode":"43419-382","isadmin":false,"isemployee":false,"userwallet":["621ac149fc13ae4f99000000"]},
                {"name":"Bryon","family":"Aimée","email":"btremoille2@shinystat.com","number":"662-419-0066","password":"87yOT3eKEPVD","address":"149 Caliangt Crossing","zipcode":"68084-040","isadmin":false,"isemployee":false,"userwallet":["621ac149fc13ae4f99000000"]},
                {"name":"Sanson","family":"Göran","email":"sgiacovetti3@tinyurl.com","number":"906-372-8564","password":"eGKDO6xzI","address":"1568 Londonderry Parkway","zipcode":"59779-490","isadmin":false,"isemployee":false,"userwallet":["621ac149fc13ae4f99000000"]},
                {"name":"Coleman","family":"Pò","email":"cgurys4@yahoo.com","number":"337-516-1488","password":"3X503O","address":"929 Cambridge Road","zipcode":"50876-182","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Rafaellle","family":"Mélissandre","email":"rwilderspoon5@blogger.com","number":"240-717-7074","password":"Uo2wCpK","address":"56190 Susan Alley","zipcode":"55154-9379","isadmin":false,"isemployee":false,"userwallet":["621ac149fc13ae4f99000000"]},
                {"name":"Nestor","family":"Lèi","email":"neverall6@bloglovin.com","number":"686-226-6738","password":"AT8cdTZsfilB","address":"5 Red Cloud Crossing","zipcode":"62584-994","isadmin":false,"isemployee":false,"userwallet":["621ac149fc13ae4f99000000"]},
                {"name":"Dominik","family":"Edmée","email":"dtaill7@mit.edu","number":"524-960-7628","password":"SHFMkHJTe","address":"49 Merry Lane","zipcode":"11822-4073","isadmin":false,"isemployee":false,"userwallet":[]},
                {"name":"Harper","family":"Eliès","email":"hheintzsch8@theglobeandmail.com","number":"648-681-5690","password":"O6wymj","address":"14 Spohn Junction","zipcode":"43269-824","isadmin":false,"isemployee":false,"userwallet":["621ac149fc13ae4f99000000"]},
                {"name":"Reinald","family":"Véronique","email":"rpalk9@bloglovin.com","number":"412-790-3129","password":"v2CemZq7SOB","address":"2 Butternut Pass","zipcode":"30142-205","isadmin":false,"isemployee":false,"userwallet":["621ac149fc13ae4f99000000"]}];
            await user.collection.insertMany(users);
            const user1 = await user.findOne({ name: "Sherlock" }).select("_id");
            let id = user1['id'];
            const res = await request(server)
                .put('/api/user/admin/' + id)
                .set('x-auth-token', token)
                .send(newuser);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('email')
        });

    });
    describe('post ', () => {
        it('should return 400 if data is not valid', async () =>  {
            let token = new user().generateAuthToken();
            const newuser = {"name":"s","family":"Célestine","email":"sturnpenny1@soup.io","number":"930-362-4662","password":"vkQmqEqs","address":"16 Browning Junction","zipcode":"43419-382","isadmin":false,"isemployee":false,"userwallet":[]};
            const res = await request(server)
                .post('/api/user/')
                .set('x-auth-token', token)
                .send(newuser);
            expect(res.status).toBe(400);
            expect(res.body.message).toEqual("اطلاعات نامعتبر است")
        });
        it('should return 404 if email is duplicate', async () =>  {
            console.log("------------------------------------------------------------------------------------------");
            let token = new user().generateAuthToken();
            const olduser = new user(
                {name:"Sherlock",
                    family:"Célestine",
                    email:"studddnpenny223231@gmail.com",
                    number:"09026983062",
                    password:"vkQmqEqs",
                    address:"16 Browning Junction",
                    zipcode:"4341938291",
                    isadmin:false,
                    isemployee:false,
                    userwallet:[]
                });
            await olduser.save();
            const newuser = {"name":"salam",
                "family":"Célestine",
                "email":"studddnpenny223231@gmail.com",
                "number":"09095343062",
                "password":"vkQmqE345qs",
                "address":"16 Browning Junction",
                "zipcode":"4341938291",
                "isadmin":false,
                "isemployee":false,
                "userwallet":[]
            };

            const res = await request(server)
                .post('/api/user/')
                .set('x-auth-token', token)
                .send(newuser);
            expect(res.status).toBe(404);
            console.log("------------------------------------------------------------------------------------------");
            expect(res.body.message).toEqual('این ایمیل تکراری می باشد')
        });
        it('should return 404 if number is duplicate', async () =>  {
            let token = new user().generateAuthToken();
            const olduser = new user({name:"Sherlock",
                family:"Célestine",
                email:"shapoor_gol@gmail.com",
                number:"09086343062",
                password:"vkQmqEqs",
                address:"16 Browning Junction",
                zipcode:"1234567891",
                isadmin:false,
                isemployee:false,
                userwallet:[]
            });
            await olduser.save();
            const newuser2 = {"name":"salam",
                "family":"Célestine",
                "email":"mamad_gol@gmail.com",
                "number":"09086343062",
                "password":"vkQmqE345qs",
                "address":"16 Browning Junction",
                "zipcode":"1234567891",
                "isadmin":false,
                "isemployee":false,
                "userwallet":[]
            };

            const res = await request(server)
                .post('/api/user/')
                .set('x-auth-token', token)
                .send(newuser2);
            expect(res.status).toBe(404);
            expect(res.body.message).toEqual('این شماره تلفن تکراری می باشد')
        });
        it('should save user', async () =>  {
            let token = new user().generateAuthToken();
            const newuser = {"name":"salam",
                "family":"Célestine",
                "email":"sturnpenny1@gmail.com",
                "number":"09046343062",
                "password":"vkQmqE345qs",
                "address":"16 Browning Junction",
                "zipcode":"1234567891",
                "isadmin":false,
                "isemployee":false,
                "userwallet":["621ac149fc13ae4f99000000"]};

            const res = await request(server)
                .post('/api/user/')
                .set('x-auth-token', token)
                .send(newuser);
            expect(res.status).toBe(200);
            expect(res.body.message).toEqual('خوش آمدید');
        });

    });
    describe('post / admin', () => {
        it('should return 401 if u are not log in', async () =>  {
            const res = await request(server).post('/api/user/admin/');
            expect(res.status).toBe(401);
            expect(res.body.message).toEqual('دسترسی شما به این قسمت محدود می باشد.')
        });
        it('should return 403 if token is invalid', async () =>  {
            let token = new user().generateAuthToken();
            token += "12"
            const res = await request(server)
                .post('/api/user/admin/')
                .set('x-auth-token', token);
            expect(res.status).toBe(403);
            expect(res.body.message).toEqual('توکن ارسالی نامعتبر می باشد')
        });
        it('should return 403 if u are not employee', async () =>  {
            let token = new user().generateAuthToken();
            const res = await request(server)
                .post('/api/user/admin/' )
                .set('x-auth-token', token);
            expect(res.status).toBe(403);
            expect(res.body.message).toEqual('دسترسی ممنوع');
        });
        it('should return 403 if u are employee but not admin', async () =>  {
            let token = await creatEmployeeUser();

            const res = await request(server)
                .post('/api/user/admin/')
                .set('x-auth-token', token);
            expect(res.status).toBe(403);
            expect(res.body.message).toEqual('دسترسی ممنوع');
        });
        it('should return 400 if data is not valid', async () =>  {
            let token = await creatAdminUser();
            const newuser = {"name":"s","family":"Célestine","email":"sturnpenny1@soup.io","number":"930-362-4662","password":"vkQmqEqs","address":"16 Browning Junction","zipcode":"43419-382","isadmin":false,"isemployee":false,"userwallet":[]};
            const res = await request(server)
                .post('/api/user/admin/')
                .set('x-auth-token', token)
                .send(newuser);
            expect(res.status).toBe(400);
            expect(res.body.message).toEqual("اطلاعات نامعتبر است")
        });
        it('should return 404 if email is duplicate', async () =>  {
            console.log("------------------------------------------------------------------------------------------");
            let token = await creatAdminUser();
            const olduser = new user(
                {name:"Sherlock",
                family:"Célestine",
                email:"studddnpenny223231@gmail.com",
                number:"09026983062",
                password:"vkQmqEqs",
                address:"16 Browning Junction",
                zipcode:"4341938291",
                isadmin:false,
                isemployee:false,
                userwallet:[]
            });
            await olduser.save();
            const newuser = {"name":"salam",
                "family":"Célestine",
                "email":"studddnpenny223231@gmail.com",
                "number":"09095343062",
                "password":"vkQmqE345qs",
                "address":"16 Browning Junction",
                "zipcode":"4341938291",
                "isadmin":false,
                "isemployee":false,
                "userwallet":[]
            };

            const res = await request(server)
                .post('/api/user/admin/')
                .set('x-auth-token', token)
                .send(newuser);
            expect(res.status).toBe(404);
            console.log("------------------------------------------------------------------------------------------");
            expect(res.body.message).toEqual('این ایمیل تکراری می باشد')
        });
        it('should return 404 if number is duplicate', async () =>  {
            let token = await creatAdminUser();
            const olduser = new user({name:"Sherlock",
                family:"Célestine",
                email:"shapoor_gol@gmail.com",
                number:"09086343062",
                password:"vkQmqEqs",
                address:"16 Browning Junction",
                zipcode:"1234567891",
                isadmin:false,
                isemployee:false,
                userwallet:[]
            });
            await olduser.save();
            const newuser2 = {"name":"salam",
                "family":"Célestine",
                "email":"mamad_gol@gmail.com",
                "number":"09086343062",
                "password":"vkQmqE345qs",
                "address":"16 Browning Junction",
                "zipcode":"1234567891",
                "isadmin":false,
                "isemployee":false,
                "userwallet":[]
            };

            const res = await request(server)
                .post('/api/user/admin/')
                .set('x-auth-token', token)
                .send(newuser2);
            expect(res.status).toBe(404);
            expect(res.body.message).toEqual('این شماره تلفن تکراری می باشد')
        });
        it('should save user', async () =>  {
            let token = await creatAdminUser();
            const newuser = {"name":"salam",
                "family":"Célestine",
                "email":"sturnpenny1@gmail.com",
                "number":"09046343062",
                "password":"vkQmqE345qs",
                "address":"16 Browning Junction",
                "zipcode":"1234567891",
                "isadmin":false,
                "isemployee":false,
                "userwallet":["621ac149fc13ae4f99000000"]};

            const res = await request(server)
                .post('/api/user/admin/')
                .set('x-auth-token', token)
                .send(newuser);
            expect(res.status).toBe(200);
            expect(res.body.message).toEqual('خوش آمدید');
        });

    });




});










creatAdminUser = async function () {
    console.log('===========> in  creatUser <============');

    const newuser = new user({
        name: "محمد",
        family: "علائی",
        number: "09036343062",
        password: "56500600",
        isadmin: "true",
        isemployee: "true",
        userwallet: []
    });
    const saveduser= await newuser.save();

    await console.log('===========1> in  creatUser <1============' + saveduser);
    const token = await saveduser.generateAuthToken();
    await console.log('===========> in  creatUser <============' + token);


    return  token;
}

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