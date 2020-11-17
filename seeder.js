const Admin = require("./models/Admin");
const Order = require("./models/Order");
const Product = require("./models/Product");
const Category = require("./models/Category");
const User = require("./models/User");
const fetch = require("node-fetch");
const faker = require("faker");
faker.locale = "es";
var slugify = require("slugify");
let axios = require("axios");

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

    let products = await axios
      .get("https://fakestoreapi.com/products")
      .then((res) => res.data);

    let idCategories = [];
    let categories = ["Celulares", "Computadoras", "Televisores", "Textil"];
    for (let g = 0; g < categories.length; g++) {
      const category = await new Category({
        name: categories[g],
      });
      idCategories.push(category._id);
      category.save();
    }

    let users = [];
    let products_list = [];

    if (await products) {
      //Crar productos
      for (let i = 0; i < products.length; i++) {
        let name = faker.commerce.productName();
        const product = new Product({
          name: products[i].title,
          description: products[i].description,
          price: products[i].price,
          brand: faker.random.arrayElement(["Samsung", "Apple", "LG", "Nike"], 4),
          pictures: [products[i].image, faker.image.technics(), faker.image.technics()],
          stock: faker.random.number(),
          category: faker.random.arrayElement(idCategories, 4),
          outstanding: faker.random.boolean(),
          slug: slugify(name),
        });
        products_list.push(product);
        await product.save();
      }
      //For create users

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
              products: [],
              state: "Sin pagar",
            });
            let product_aux = { ...products_list[0]._doc };
            product_aux.quantity = 2;
            order.products.push(product_aux);
            product_aux = { ...products_list[1]._doc };
            product_aux.quantity = 3;
            order.products.push(product_aux);
            console.log(order);
            order.save();
            user.orders.push(order);
          }
        }
        user.save();
        users.push(user);
      }

      //For create users
    }

    //Crar productos

    res.json({ adminUser, users, products_list });
  },
};

module.exports = seeder;
