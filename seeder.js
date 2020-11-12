const Admin = require("./models/Admin");
const Order = require("./models/Order");
const Product = require("./models/Product");
const Category = require("./models/Category");
const User = require("./models/User");
const fetch = require("node-fetch");
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
    Category.collection.remove();
    const adminUser = new Admin({
      firstname: "root",
      lastname: "root",
      active: true,
      email: "root@gmail.com",
      password: "1234",
    });
    adminUser.save();

    let idCategories = [];
    let categories = ["Celulares", "Computadoras", "Televisores", "Textil"];
    for (let g = 0; g < categories.length; g++) {
      const category = await new Category({
        name: categories[g],
      });
      idCategories.push(category._id);
      category.save();
    }

    let products = fetch("https://fakestoreapi.com/products/1")
      .then((res) => res.json())
      .then((json) => console.log(json));

    //Crar productos
    let products_list = [];
    for (let i = 0; i < products_list.length; i++) {
      let name = faker.commerce.productName();
      const product = new Product({
        name: products_list[i].title,
        description: products_list[i].description,
        price: products_list[i].price,
        brand: faker.random.arrayElement(["Samsung", "Apple", "LG", "Nike"], 4),
        pictures: [
          products_list[i].image,
          faker.image.technics(),
          faker.image.technics(),
        ],
        stock: faker.random.number(),
        category: faker.random.arrayElement(idCategories, 4),
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
