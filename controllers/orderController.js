const Order = require("../models/Order");
const orderController = require("../models/Order");

module.exports = {
  store: async (req, res) => {
    const newOrder = {
      state: "Sin pagar",
      products: req.body.products,
      user: req.body.id,
    };
    newOrder.save();
    res.json({ Exitoso: "Orden creada correctamente" });
  },

  updateState: async (req, res) => {
    Order.findByIdAndUpdate(req.body.id, { state: req.body.state });
    res.json({ Exitoso: `El nuevo estado del pedido es: ${req.body.state}` });
  },
};
