const algoliasearch = require("algoliasearch");
const client = algoliasearch("CKVUOZDP79", "61cafd3708c4b9032a72653784b75694");
const index = client.initIndex("electrohack");
const Products = require("./models/Product");

module.exports = {
  getData: async (req, res) => {
    let products = await Products.find({});
    try {
      if (await products) {
        index
          .saveObjects(products, { autoGenerateObjectIDIfNotExist: true })
          .then(({ productsIDs }) => {});
        res.json(products);
      }
    } catch (error) {}
  },
};
