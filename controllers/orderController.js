const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");

module.exports = {
  store: async (req, res) => {
    const newOrder = await new Order({
      state: "Sin pagar",
      products: req.body.products,
      user: req.user.id,
    });
    newOrder.save();
    const changedUser = await User.findOne({ _id: newOrder.user });
    changedUser.orders.push(newOrder.id);
    changedUser.save();
    //
    newOrder.products.forEach(async (el) => {
      let product_aux = await Product.findById(el._id);
      if (await product_aux) {
        product_aux.stock = product_aux.stock - el.quantity;
        product_aux.save();
      }
    });

    res.json({ Exitoso: "Orden creada correctamente", newOrder: newOrder });
  },

  updateState: async (req, res) => {
    Order.findByIdAndUpdate(req.body.id, { state: req.body.state });
    res.json({ Exitoso: `El nuevo estado del pedido es: ${req.body.state}` });
  },

  show: async (req, res) => {
    console.log(req.user.id);
    const orders = await Order.find({ user: req.user.id });
    return res.json(orders);
  },
};
