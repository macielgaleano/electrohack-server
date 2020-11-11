const db = require("./models/index");
const Admin = require("./models/Admin");
const Order = require("./models/Order");
const Product = require("./models/Product");
const User = require("./models/User");
const faker = require("faker");
faker.locale = "es";
var slugify = require("slugify");

const seeder = {
  createData: async (req, res) => {
    //Crear el primer usuario admin
    Admin.collection.remove();
    Order.collection.remove();
    Product.collection.remove();
    User.collection.remove();
    const adminUser = new Admin({
      firstname: "root",
      lastname: "root",
      email: "root@gmail.com",
      password: "1234",
    });
    adminUser.save();

    //Crar productos
    let products = [];
    for (let i = 0; i < 30; i++) {
      let name = faker.commerce.productName();
      const product = new Product({
        name: name,
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        brand: faker.random.arrayElement(["Samsung", "Apple", "LG", "Nike"], 4),
        pictures: [
          "https://conecta22222.s3.amazonaws.com/upload_1774951430c2d6592d39d6d801834c96.jpg",
          faker.image.technics(),
          faker.image.technics(),
        ],
        stock: faker.random.number(),
        category: faker.random.arrayElement(
          ["Celulares", "Computadoras", "Televisores", "Textil"],
          4
        ),
        outstanding: faker.random.boolean(),
        slug: slugify(name),
      });
      products.push(product);
      await product.save();
    }
    //For create users
    let users = [];
    for (let i = 0; i < 10; i++) {
      const user = new User({
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        email: faker.internet.email(),
        password: "1234",
        address: faker.address.direction(),
        phone: faker.phone.phoneNumber(),
        orders: [],
      });
      let number = faker.random.arrayElement([0, 1, 2, 4, 5], 6);
      if (number > 0) {
        for (let u = 0; u < number; u++) {
          const order = new Order({
            user: user._id,
            products: await Product.find({}).limit(6),
            state: "0",
          });
          order.save();
          user.orders.push(order);
        }
      }
      user.save();
      users.push(user);
    }

    res.json({ adminUser, users, products });
  },
};

module.exports = seeder;
