const db = require("../models/index");
const Product = require("../models/Product");
const Order = require("../models/Order");
const algoliasearch = require("algoliasearch");
const client = algoliasearch("PW7Q8HCMTL", "4eadc8f72bc64cbf48d67887005cb3c1");
const index = client.initIndex("test_MOVIES");
const AWS = require("aws-sdk");
const formidable = require("formidable");
const path = require("path");
const fs = require("fs");
const Category = require("../models/Category");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_ID,
  secretAccessKey: process.env.AWS_ACCESS_SECRET,
});
//
var readOnlyAnonUserPolicy = {
  Version: "2012-10-17",
  Statement: [
    {
      Sid: "AddPerm",
      Effect: "Allow",
      Principal: "*",
      Action: ["s3:GetObject"],
      Resource: [""],
    },
  ],
};

const productController = {
  all: async (req, res) => {
    console.log(req.query);

    if (!req.query) {
      let = await Product.find({});

      res.json(products);
    } else if (req.query.outstading === "false") {
      res.json(await Product.find({ outstanding: false }));
    } else if (req.query.outstading === "true") {
      res.json(await Product.find({ outstanding: true }));
    }

    if (req.query.brand) {
      res.json(await Product.find({ brand: req.query.brand }));
    }

    if (req.query.category) {
      let category = await Category.findOne({ name: req.query.category });

      res.json(await Product.find({ category: category._id }));
    } else {
      res.json(await Product.find({}));
    }
  },
  groupByDate: async (req, res) => {
    console.log(await Order.find({}));
    const FIRST_MONTH = 1;
    const LAST_MONTH = 12;
    const MONTHS_ARRAY = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    let TODAY = "2019-11-18T20:27:49.032Z";
    let YEAR_BEFORE = "2019-11-18T20:27:49.032Z";

    res.json(
      await Order.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            list: { $push: "$$ROOT" },
            count: { $sum: 1 },
          },
        },
      ])
    );
  },

  show: async (req, res) => {
    res.json(await Product.find({ slug: req.params.slug }));
  },
  updateImage: (req, res) => {
    let bucketResource = "arn:aws:s3:::" + process.env.AWS_BUCKET_NAME + "/*";
    readOnlyAnonUserPolicy.Statement[0].Resource[0] = bucketResource;
    let bucketPolicyParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Policy: JSON.stringify(readOnlyAnonUserPolicy),
    };
    s3.putBucketPolicy(bucketPolicyParams, function (err, data) {
      if (err) {
        res.status(500).json({ message: "Internal server error" + err });
      } else {
        console.log("Success");
      }
    });
    s3.createBucket({ Bucket: process.env.AWS_BUCKET_NAME }, function (err, data) {
      if (err) res.status(500).json({ message: "Internal server error" + err });
      else console.log("Bucket Created Successfully", data.Location);
    });

    const form = formidable({
      multiples: true,
      uploadDir: "./public/images",
      keepExtensions: true,
    });
    form.parse(req, async (err, fields, files) => {
      if (files) {
        console.log(fields);
        const imagen = "./public/images/" + path.basename(files.imagen.path);
        const fileContent = fs.readFileSync(imagen);
        const params = {
          ACL: "public-read",
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: path.basename(files.imagen.path),
          ContentType: "image/jpeg",
          Body: fileContent,
        };
        s3.upload(params, async function (err, data) {
          const product = await Product.findOne({ slug: fields.slug });
          product.pictures.push(await data.Location);
          product.save();
          return res.json({ status: 200, data: data.location });
        });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    });
  },
  update: async (req, res) => {
    let {
      name,
      description,
      price,
      brand,
      pictures,
      stock,
      category,
      outstanding,
    } = req.body;
    Product.updateOne(
      { name: name },
      {
        name: name,
        description: description,
        price: price,
        brand: brand,
        pictures: pictures,
        stock: stock,
        category: category,
        outstanding: outstanding,
      }
    );
    res.json({ messague: "Datos actualizados" });
  },
  delete: async (req, res) => {
    if (req.body.slug) {
      Product.deleteOne({ slug: req.body.slug });
      res.status(200).json({ messague: "Producto eliminado" });
    } else {
      res.status(401).json({ status: 401, error: "No existe el producto" });
    }
  },

  store: async (req, res) => {
    let {
      name,
      description,
      price,
      brand,
      pictures,
      stock,
      category,
      outstanding,
    } = req.body;
    let product = new Product({
      name: name,
      description: description,
      price: price,
      brand: brand,
      pictures: pictures,
      stock: stock,
      category: category,
      outstanding: outstanding,
    });
    product.save();
    res.json(product);
  },
  showByCategory: async (req, res) => {
    const category = await Category.findOne({ name: req.params.categoria });
    const products = await Product.find({ category: category._id });
    res.json(products);
  },
};

module.exports = productController;
