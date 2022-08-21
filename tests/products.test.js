const request = require('supertest');
const {product} = require('../datamodels/productdm');
const {user} = require('../datamodels/userdm');
const mongoose = require('mongoose');

let server;

describe('/api/genres', () => {
  beforeEach(() => { server = require('../app'); })
  afterEach(async () => { 
    server.close(); 
    await product.remove({});
    await user.remove({});
  });

  describe('GET /', () => {
    it('should return all products', async () => {
      const products = [
        {"title":"Cheese - Oka","desc":"Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.","kind":"sotian","price":48,"brand":"vestibulum","colors":"Fuscia","size":59,"inventory":8},
        {"title":"Doilies - 10, Paper","desc":"Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.","kind":"set","price":31,"brand":"praesent blandit","colors":"Orange","size":87,"inventory":7},
        {"title":"Cake - French Pear Tart","desc":"Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.","kind":"short","price":79,"brand":"ante","colors":"Mauv","size":52,"inventory":7},
        {"title":"Soup Campbells","desc":"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin risus. Praesent lectus.\n\nVestibulum quam sapien, varius ut, blandit non, interdum in, ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio. Curabitur convallis.","kind":"set","price":66,"brand":"nulla tellus","colors":"Violet","size":75,"inventory":3}
      ];
      await product.collection.insertMany(products);
      const res = await request(server).get('/api/product');
      expect(res.status).toBe(200);
      expect(res.body[1]).toHaveProperty("title");
      // expect(res.body.length).toBeGreaterThan(3);
      // expect(res.body.length).toBe(4);
    });
    it('should return 403 if objectId is not valid', async () => {
      const products = [
        {"title":"Cheese - Oka","desc":"Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.","kind":"sotian","price":48,"brand":"vestibulum","colors":"Fuscia","size":59,"inventory":8},
        {"title":"Doilies - 10, Paper","desc":"Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.","kind":"set","price":31,"brand":"praesent blandit","colors":"Orange","size":87,"inventory":7},
        {"title":"Cake - French Pear Tart","desc":"Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.","kind":"short","price":79,"brand":"ante","colors":"Mauv","size":52,"inventory":7},
        {"title":"Soup Campbells","desc":"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin risus. Praesent lectus.\n\nVestibulum quam sapien, varius ut, blandit non, interdum in, ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio. Curabitur convallis.","kind":"set","price":66,"brand":"nulla tellus","colors":"Violet","size":75,"inventory":3}
      ];
      await product.collection.insertMany(products);
      const product1 = await product.findOne({ title: "Cheese - Oka" }).select("_id");
      let id = product1['id'];
      id += "a23";
      const res = await request(server).get('/api/product/' + id);
      expect(res.status).toBe(400);
      expect(res.body.message).toEqual('آیدی ارسال شده نامعتبر است')
    });
    it('should return 404 if product not found', async () => {
      const products = [
        {"title":"Cheese - Oka","desc":"Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.","kind":"sotian","price":48,"brand":"vestibulum","colors":"Fuscia","size":59,"inventory":8},
        {"title":"Doilies - 10, Paper","desc":"Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.","kind":"set","price":31,"brand":"praesent blandit","colors":"Orange","size":87,"inventory":7},
        {"title":"Cake - French Pear Tart","desc":"Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.","kind":"short","price":79,"brand":"ante","colors":"Mauv","size":52,"inventory":7},
        {"title":"Soup Campbells","desc":"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin risus. Praesent lectus.\n\nVestibulum quam sapien, varius ut, blandit non, interdum in, ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio. Curabitur convallis.","kind":"set","price":66,"brand":"nulla tellus","colors":"Violet","size":75,"inventory":3}
      ];
      await product.collection.insertMany(products);
      const product1 = await product.findOne({ title: "Cheese - Oka" }).select("_id");
      let id = product1['id'];
      await product.findByIdAndRemove(id)
      const res = await request(server).get('/api/product/' + id);
      expect(res.status).toBe(404);
      expect(res.body.message).toEqual('کالا مورد نظر یافت نشد')
    });
    it('should return product', async () => {
      const products = [
        {"title":"Cheese - Oka","desc":"Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.","kind":"sotian","price":48,"brand":"vestibulum","colors":"Fuscia","size":59,"inventory":8},
        {"title":"Doilies - 10, Paper","desc":"Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.","kind":"set","price":31,"brand":"praesent blandit","colors":"Orange","size":87,"inventory":7},
        {"title":"Cake - French Pear Tart","desc":"Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.","kind":"short","price":79,"brand":"ante","colors":"Mauv","size":52,"inventory":7},
        {"title":"Soup Campbells","desc":"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin risus. Praesent lectus.\n\nVestibulum quam sapien, varius ut, blandit non, interdum in, ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio. Curabitur convallis.","kind":"set","price":66,"brand":"nulla tellus","colors":"Violet","size":75,"inventory":3}
      ];
      await product.collection.insertMany(products);
      const product1 = await product.findOne({ title: "Cheese - Oka" }).select("_id");
      let id = product1['id'];
      const res = await request(server).get('/api/product/' + id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('title');
    });
  });
  describe('Delete /', () => {
    it('should return 401 if u are not log in', async () => {
      const products = [
        {"title":"Cheese - Oka","desc":"Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.","kind":"sotian","price":48,"brand":"vestibulum","colors":"Fuscia","size":59,"inventory":8},
        {"title":"Doilies - 10, Paper","desc":"Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.","kind":"set","price":31,"brand":"praesent blandit","colors":"Orange","size":87,"inventory":7},
        {"title":"Cake - French Pear Tart","desc":"Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.","kind":"short","price":79,"brand":"ante","colors":"Mauv","size":52,"inventory":7},
        {"title":"Soup Campbells","desc":"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin risus. Praesent lectus.\n\nVestibulum quam sapien, varius ut, blandit non, interdum in, ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio. Curabitur convallis.","kind":"set","price":66,"brand":"nulla tellus","colors":"Violet","size":75,"inventory":3}
      ];
      await product.collection.insertMany(products);
      const product1 = await product.findOne({ title: "Cheese - Oka" }).select("_id");
      let id = product1['id'];
      const res = await request(server).delete('/api/product/' + id);
      expect(res.status).toBe(401);
      expect(res.body.message).toEqual('دسترسی شما به این قسمت محدود می باشد.')
    });
    it('should return 403 if token is invalid', async () => {
      let token = new user().generateAuthToken();
      token += "12"
      const products = [
        {"title":"Cheese - Oka","desc":"Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.","kind":"sotian","price":48,"brand":"vestibulum","colors":"Fuscia","size":59,"inventory":8},
        {"title":"Doilies - 10, Paper","desc":"Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.","kind":"set","price":31,"brand":"praesent blandit","colors":"Orange","size":87,"inventory":7},
        {"title":"Cake - French Pear Tart","desc":"Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.","kind":"short","price":79,"brand":"ante","colors":"Mauv","size":52,"inventory":7},
        {"title":"Soup Campbells","desc":"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin risus. Praesent lectus.\n\nVestibulum quam sapien, varius ut, blandit non, interdum in, ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio. Curabitur convallis.","kind":"set","price":66,"brand":"nulla tellus","colors":"Violet","size":75,"inventory":3}
      ];
      await product.collection.insertMany(products);
      const product1 = await product.findOne({ title: "Cheese - Oka" }).select("_id");
      let id = product1['id'];
      const res = await request(server)
          .delete('/api/product/' + id)
          .set('x-auth-token', token);
      expect(res.status).toBe(403);
      expect(res.body.message).toEqual('توکن ارسالی نامعتبر می باشد')
    });
    it('should return 403 if u are not employee', async () => {
      const token = new user().generateAuthToken();
      const products = [
        {"title":"Cheese - Oka","desc":"Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.","kind":"sotian","price":48,"brand":"vestibulum","colors":"Fuscia","size":59,"inventory":8},
        {"title":"Doilies - 10, Paper","desc":"Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.","kind":"set","price":31,"brand":"praesent blandit","colors":"Orange","size":87,"inventory":7},
        {"title":"Cake - French Pear Tart","desc":"Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.","kind":"short","price":79,"brand":"ante","colors":"Mauv","size":52,"inventory":7},
        {"title":"Soup Campbells","desc":"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin risus. Praesent lectus.\n\nVestibulum quam sapien, varius ut, blandit non, interdum in, ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio. Curabitur convallis.","kind":"set","price":66,"brand":"nulla tellus","colors":"Violet","size":75,"inventory":3}
      ];
      await product.collection.insertMany(products);
      const product1 = await product.findOne({ title: "Cheese - Oka" }).select("_id");
      let id = product1['id'];
      const res = await request(server)
          .delete('/api/product/' + id)
          .set('x-auth-token', token);
      expect(res.status).toBe(403);
      expect(res.body.message).toEqual('دسترسی ممنوع')
    });
    it('should return 403 if objectId is not valid', async () => {
      const token = await creatEmployeeUser();
      console.log("delete token is =======>" + token);
      const products = [
        {"title":"Cheese - Oka","desc":"Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.","kind":"sotian","price":48,"brand":"vestibulum","colors":"Fuscia","size":59,"inventory":8},
        {"title":"Doilies - 10, Paper","desc":"Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.","kind":"set","price":31,"brand":"praesent blandit","colors":"Orange","size":87,"inventory":7},
        {"title":"Cake - French Pear Tart","desc":"Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.","kind":"short","price":79,"brand":"ante","colors":"Mauv","size":52,"inventory":7},
        {"title":"Soup Campbells","desc":"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin risus. Praesent lectus.\n\nVestibulum quam sapien, varius ut, blandit non, interdum in, ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio. Curabitur convallis.","kind":"set","price":66,"brand":"nulla tellus","colors":"Violet","size":75,"inventory":3}
      ];
      await product.collection.insertMany(products);
      const product1 = await product.findOne({ title: "Cheese - Oka" }).select("_id");
      let id = product1['id'];
      id += "a23";
      const res = await request(server)
          .delete('/api/product/' + id)
          .set('x-auth-token', token);
      expect(res.status).toBe(400);
      expect(res.body.message).toEqual('آیدی ارسال شده نامعتبر است')
    });
    it('should return 404 if product not found', async () => {
      const token = await creatEmployeeUser();
      console.log("delete token is =======>" + token);
      const products = [
        {"title":"Cheese - Oka","desc":"Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.","kind":"sotian","price":48,"brand":"vestibulum","colors":"Fuscia","size":59,"inventory":8},
        {"title":"Doilies - 10, Paper","desc":"Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.","kind":"set","price":31,"brand":"praesent blandit","colors":"Orange","size":87,"inventory":7},
        {"title":"Cake - French Pear Tart","desc":"Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.","kind":"short","price":79,"brand":"ante","colors":"Mauv","size":52,"inventory":7},
        {"title":"Soup Campbells","desc":"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin risus. Praesent lectus.\n\nVestibulum quam sapien, varius ut, blandit non, interdum in, ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio. Curabitur convallis.","kind":"set","price":66,"brand":"nulla tellus","colors":"Violet","size":75,"inventory":3}
      ];
      await product.collection.insertMany(products);
      const product1 = await product.findOne({ title: "Cheese - Oka" }).select("_id");
      let id = product1['id'];
      await product.findByIdAndRemove(id)
      const res = await request(server)
          .delete('/api/product/' + id)
          .set('x-auth-token', token);
      expect(res.status).toBe(404);
      expect(res.body.message).toEqual('کالا مورد نظر یافت نشد')
    });
    it('should delete product', async () => {
      const token = await creatEmployeeUser();
      console.log("delete token is =======>" + token);
      const products = [
        {"title":"Cheese - Oka","desc":"Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.","kind":"sotian","price":48,"brand":"vestibulum","colors":"Fuscia","size":59,"inventory":8},
        {"title":"Doilies - 10, Paper","desc":"Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.","kind":"set","price":31,"brand":"praesent blandit","colors":"Orange","size":87,"inventory":7},
        {"title":"Cake - French Pear Tart","desc":"Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.","kind":"short","price":79,"brand":"ante","colors":"Mauv","size":52,"inventory":7},
        {"title":"Soup Campbells","desc":"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin risus. Praesent lectus.\n\nVestibulum quam sapien, varius ut, blandit non, interdum in, ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio. Curabitur convallis.","kind":"set","price":66,"brand":"nulla tellus","colors":"Violet","size":75,"inventory":3}
      ];
      await product.collection.insertMany(products);
      const product1 = await product.findOne({ title: "Cheese - Oka" }).select("_id");
      let id = product1['id'];
      const res = await request(server)
          .delete('/api/product/' + id)
          .set('x-auth-token', token);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('title');
    });
  });
  describe('Put /', () => {
    it('should return 401 if u are not loged in', async () => {
      const products = [
        {"title":"Cheese - Oka","desc":"Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.","kind":"sotian","price":48,"brand":"vestibulum","colors":"Fuscia","size":59,"inventory":8},
        {"title":"Doilies - 10, Paper","desc":"Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.","kind":"set","price":31,"brand":"praesent blandit","colors":"Orange","size":87,"inventory":7},
        {"title":"Cake - French Pear Tart","desc":"Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.","kind":"short","price":79,"brand":"ante","colors":"Mauv","size":52,"inventory":7},
        {"title":"Soup Campbells","desc":"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin risus. Praesent lectus.\n\nVestibulum quam sapien, varius ut, blandit non, interdum in, ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio. Curabitur convallis.","kind":"set","price":66,"brand":"nulla tellus","colors":"Violet","size":75,"inventory":3}
      ];
      await product.collection.insertMany(products);
      const product1 = await product.findOne({ title: "Cheese - Oka" }).select("_id");
      let id = product1['id'];


      const newproduct = {"title":"salam","desc":"Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.","kind":"sotian","price":48,"brand":"vestibulum","colors":"Fuscia","size":59,"inventory":8};
      const res = await request(server).put('/api/product/' + id).send(newproduct);
      expect(res.status).toBe(401);
      expect(res.body.message).toEqual('دسترسی شما به این قسمت محدود می باشد.')
    });
    it('should return 403 if token is invalid', async () => {
      const token = "sdncu4543nknfv";
      const products = [
        {"title":"Cheese - Oka","desc":"Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.","kind":"sotian","price":48,"brand":"vestibulum","colors":"Fuscia","size":59,"inventory":8},
        {"title":"Doilies - 10, Paper","desc":"Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.","kind":"set","price":31,"brand":"praesent blandit","colors":"Orange","size":87,"inventory":7},
        {"title":"Cake - French Pear Tart","desc":"Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.","kind":"short","price":79,"brand":"ante","colors":"Mauv","size":52,"inventory":7},
        {"title":"Soup Campbells","desc":"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin risus. Praesent lectus.\n\nVestibulum quam sapien, varius ut, blandit non, interdum in, ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio. Curabitur convallis.","kind":"set","price":66,"brand":"nulla tellus","colors":"Violet","size":75,"inventory":3}
      ];
      await product.collection.insertMany(products);
      const product1 = await product.findOne({ title: "Cheese - Oka" }).select("_id");
      let id = product1['id'];

      const newproduct = {"title":"salam","desc":"Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.","kind":"sotian","price":48,"brand":"vestibulum","colors":"Fuscia","size":59,"inventory":8};
      const res = await request(server)
          .put('/api/product/' + id)
          .set('x-auth-token', token)
          .send(newproduct);
      expect(res.status).toBe(403);
      expect(res.body.message).toEqual('توکن ارسالی نامعتبر می باشد')
    });
    it('should return 403 if u are not employee', async () => {
      const token = new user().generateAuthToken();
      const products = [
        {"title":"Cheese - Oka","desc":"Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.","kind":"sotian","price":48,"brand":"vestibulum","colors":"Fuscia","size":59,"inventory":8},
        {"title":"Doilies - 10, Paper","desc":"Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.","kind":"set","price":31,"brand":"praesent blandit","colors":"Orange","size":87,"inventory":7},
        {"title":"Cake - French Pear Tart","desc":"Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.","kind":"short","price":79,"brand":"ante","colors":"Mauv","size":52,"inventory":7},
        {"title":"Soup Campbells","desc":"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin risus. Praesent lectus.\n\nVestibulum quam sapien, varius ut, blandit non, interdum in, ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio. Curabitur convallis.","kind":"set","price":66,"brand":"nulla tellus","colors":"Violet","size":75,"inventory":3}
      ];
      await product.collection.insertMany(products);
      const product1 = await product.findOne({ title: "Cheese - Oka" }).select("_id");
      let id = product1['id'];

      const newproduct = {"title":"salam","desc":"Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.","kind":"sotian","price":48,"brand":"vestibulum","colors":"Fuscia","size":59,"inventory":8};
      const res = await request(server)
          .put('/api/product/' + id)
          .set('x-auth-token', token)
          .send(newproduct);
      expect(res.status).toBe(403);
      expect(res.body.message).toEqual('دسترسی ممنوع')
    });
    it('should return 403 if objectId is not valid', async () => {
      const token = await creatEmployeeUser();
      const products = [
        {"title":"Cheese - Oka","desc":"Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.","kind":"sotian","price":48,"brand":"vestibulum","colors":"Fuscia","size":59,"inventory":8},
        {"title":"Doilies - 10, Paper","desc":"Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.","kind":"set","price":31,"brand":"praesent blandit","colors":"Orange","size":87,"inventory":7},
        {"title":"Cake - French Pear Tart","desc":"Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.","kind":"short","price":79,"brand":"ante","colors":"Mauv","size":52,"inventory":7},
        {"title":"Soup Campbells","desc":"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin risus. Praesent lectus.\n\nVestibulum quam sapien, varius ut, blandit non, interdum in, ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio. Curabitur convallis.","kind":"set","price":66,"brand":"nulla tellus","colors":"Violet","size":75,"inventory":3}
      ];
      await product.collection.insertMany(products);
      const product1 = await product.findOne({ title: "Cheese - Oka" }).select("_id");
      let id = product1['id'];
      id += "a23"
      const newproduct = {"title":"salam","desc":"Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.","kind":"sotian","price":48,"brand":"vestibulum","colors":"Fuscia","size":59,"inventory":8};
      const res = await request(server)
          .put('/api/product/' + id)
          .set('x-auth-token', token)
          .send(newproduct);
      expect(res.status).toBe(400);
      expect(res.body.message).toEqual('آیدی ارسال شده نامعتبر است')
    });
    it('should return 400 if data is not valid ', async () => {
      const token = await creatEmployeeUser();
      const products = [
        {"title":"Cheese - Oka","desc":"Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.","kind":"sotian","price":48,"brand":"vestibulum","colors":"Fuscia","size":59,"inventory":8},
        {"title":"Doilies - 10, Paper","desc":"Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.","kind":"set","price":31,"brand":"praesent blandit","colors":"Orange","size":87,"inventory":7},
        {"title":"Cake - French Pear Tart","desc":"Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.","kind":"short","price":79,"brand":"ante","colors":"Mauv","size":52,"inventory":7},
        {"title":"Soup Campbells","desc":"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin risus. Praesent lectus.\n\nVestibulum quam sapien, varius ut, blandit non, interdum in, ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio. Curabitur convallis.","kind":"set","price":66,"brand":"nulla tellus","colors":"Violet","size":75,"inventory":3}
      ];
      await product.collection.insertMany(products);
      const product1 = await product.findOne({ title: "Cheese - Oka" }).select("_id");
      let id = product1['id'];
      const newproduct = {
        "title":"salam",
        "desc":"Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.",
        "kind":"sotian",
        "price":48,
        "brand":"vestibulum",
        "colors":"Fuscia",
        "size":59,
        "inventory":8
      };
      const res = await request(server)
          .put('/api/product/' + id)
          .set('x-auth-token', token)
          .send(newproduct);
      expect(res.status).toBe(400);
      expect(res.body.message).toEqual("اطلاعات نامعتبر است.")
    });
    it('should return 404 if product not found', async () => {
      const token = await creatEmployeeUser();
      const products = [
        {"title":"Cheese - Oka","desc":"Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.","kind":"sotian","price":48,"brand":"vestibulum","colors":"Fuscia","size":59,"inventory":8},
        {"title":"Doilies - 10, Paper","desc":"Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.","kind":"set","price":31,"brand":"praesent blandit","colors":"Orange","size":87,"inventory":7},
        {"title":"Cake - French Pear Tart","desc":"Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.","kind":"short","price":79,"brand":"ante","colors":"Mauv","size":52,"inventory":7},
        {"title":"Soup Campbells","desc":"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin risus. Praesent lectus.\n\nVestibulum quam sapien, varius ut, blandit non, interdum in, ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio. Curabitur convallis.","kind":"set","price":66,"brand":"nulla tellus","colors":"Violet","size":75,"inventory":3}
      ];
      await product.collection.insertMany(products);
      const product1 = await product.findOne({ title: "Cheese - Oka" }).select("_id");
      let id = product1['id'];
      console.log("id ===========> " + id )
      await product.findByIdAndRemove(id)

      const newproduct = {
        "title":"salam",
        "desc":"Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.",
        "kind":"621926310d3da994123f5114",
        "price":48,
        "brand":"vestibulum",
        "colors":["Fuscia"],
        "size":[59],
        "inventory":8
      };
      const res = await request(server)
          .put('/api/product/' + id)
          .set('x-auth-token', token)
          .send(newproduct);
      expect(res.status).toBe(404);
      expect(res.body.message).toEqual('کالا مورد نظر یافت نشد')
    });
    it('should update product', async () => {
      const token = await creatEmployeeUser();
      const products = [
        {"title":"Cheese - Oka","desc":"Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.","kind":"sotian","price":48,"brand":"vestibulum","colors":"Fuscia","size":59,"inventory":8},
        {"title":"Doilies - 10, Paper","desc":"Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.","kind":"set","price":31,"brand":"praesent blandit","colors":"Orange","size":87,"inventory":7},
        {"title":"Cake - French Pear Tart","desc":"Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.","kind":"short","price":79,"brand":"ante","colors":"Mauv","size":52,"inventory":7},
        {"title":"Soup Campbells","desc":"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin risus. Praesent lectus.\n\nVestibulum quam sapien, varius ut, blandit non, interdum in, ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio. Curabitur convallis.","kind":"set","price":66,"brand":"nulla tellus","colors":"Violet","size":75,"inventory":3}
      ];
      await product.collection.insertMany(products);
      const product1 = await product.findOne({ title: "Cheese - Oka" }).select("_id");
      let id = product1['id'];
      console.log("id ===========> " + id )
      const newproduct = {
        "title":"salam",
        "desc":"Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.",
        "kind":"621926310d3da994123f5114",
        "price":48,
        "brand":"vestibulum",
        "colors":["Fuscia"],
        "size":[59],
        "inventory":8
      };
      const res = await request(server)
          .put('/api/product/' + id)
          .set('x-auth-token', token)
          .send(newproduct);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('title');
    });
  });
  describe('Post /', () => {
    it('should return 401 if u are not loged in', async () => {
      const newproduct = {"title":"salam","desc":"Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.","kind":"sotian","price":48,"brand":"vestibulum","colors":"Fuscia","size":59,"inventory":8};
      const res = await request(server).post('/api/product/' ).send(newproduct);
      expect(res.status).toBe(401);
      expect(res.body.message).toEqual('دسترسی شما به این قسمت محدود می باشد.')
    });
    it('should return 403 if token is invalid', async () => {
      const token = "sdncu4543nknfv";
      const newproduct = {"title":"salam","desc":"Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.","kind":"sotian","price":48,"brand":"vestibulum","colors":"Fuscia","size":59,"inventory":8};
      const res = await request(server)
          .post('/api/product/')
          .set('x-auth-token', token)
          .send(newproduct);
      expect(res.status).toBe(403);
      expect(res.body.message).toEqual('توکن ارسالی نامعتبر می باشد')
    });
    it('should return 403 if u are not employee', async () => {
      const token = new user().generateAuthToken();
      const newproduct = {"title":"salam","desc":"Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.","kind":"sotian","price":48,"brand":"vestibulum","colors":"Fuscia","size":59,"inventory":8};
      const res = await request(server)
          .post('/api/product/')
          .set('x-auth-token', token)
          .send(newproduct);
      expect(res.status).toBe(403);
      expect(res.body.message).toEqual('دسترسی ممنوع')
    });
    it('should return 400 if data is not valid ', async () => {
      const token = await creatEmployeeUser();
      const newproduct = {
        "title":"salam",
        "desc":"Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.",
        "kind":"sotian",
        "price":48,
        "brand":"vestibulum",
        "colors":"Fuscia",
        "size":59,
        "inventory":8
      };
      const res = await request(server)
          .post('/api/product/')
          .set('x-auth-token', token)
          .send(newproduct);
      expect(res.status).toBe(400);
      expect(res.body.message).toEqual("اطلاعات نامعتبر است");
    });
    it('should saved product', async () => {
      const token = await creatEmployeeUser();
      const newproduct = {
        "title":"salam",
        "desc":"Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.",
        "kind":"621926310d3da994123f5114",
        "price":48,
        "brand":"vestibulum",
        "colors":["Fuscia"],
        "size":[59],
        "inventory":8
      };
      const res = await request(server)
          .post('/api/product/' )
          .set('x-auth-token', token)
          .send(newproduct);

      const foundproduct = await product.findOne({ title: "salam" });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('title');
      expect(foundproduct).toHaveProperty("title");
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