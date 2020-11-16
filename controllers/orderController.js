const Order = require("../models/Order");

module.exports = {
  store: async (req, res) => {
    const newOrder = new Order({
      state: "Sin pagar",
      products: req.body.products,
      user: req.user.id,
    });
    newOrder.save();
    res.json({ Exitoso: "Orden creada correctamente" });
  },

  updateState: async (req, res) => {
    Order.findByIdAndUpdate(req.body.id, { state: req.body.state });
    res.json({ Exitoso: `El nuevo estado del pedido es: ${req.body.state}` });
  },

  show: async (req, res) => {
    const orders = await Order.find({});
    res.json(orders);
  },
};
