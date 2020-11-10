const mongoose = require("mongoose");

mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
mongoose.connect(process.env.DB_CONNECTION);

mongoose.connection.once("open", () => console.log("conectado"));

module.exports = { mongoose };
