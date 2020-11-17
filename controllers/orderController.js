const Order = require("../models/Order");
const User = require("../models/User");

module.exports = {
  store: async (req, res) => {
    const newOrder = await new Order({
      state: "Sin pagar",
      products: req.body.products,
      user: req.user.id,
    });
    newOrder.save();
    const changedUser = await User.findOne({ id: newOrder.user });
    changedUser.orders.push(newOrder.id);
    changedUser.save();
    res.json({ Exitoso: "Orden creada correctamente", newOrder: newOrder });
  },

  updateState: async (req, res) => {
    Order.findByIdAndUpdate(req.body.id, { state: req.body.state });
    res.json({ Exitoso: `El nuevo estado del pedido es: ${req.body.state}` });
  },

  show: async (req, res) => {
    const orders = await Order.find({}).populate("products");
    return res.json(orders);
  },
};
