const db = require("../models/index");
const Product = require("../models/Product");
const AWS = require("aws-sdk");
const formidable = require("formidable");
const path = require("path");
const fs = require("fs");

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
    res.json(await Product.find({}));
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
    s3.createBucket({ Bucket: process.env.AWS_BUCKET_NAME }, function (
      err,
      data
    ) {
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

  showCategories: async (req, res) => {
    const categories = await Product.find({}).select("category");

    console.log(categories);

    for (let i = 0; i < categories.length; i++) {
      console.log(categories.category[i]);
      const category = categories.category[i];
    }

    return res.json();
  },

  showByCategory: async (req, res) => {
    const products = Product.find({ category: req.body.category });
    res.json(products);
  },
};

module.exports = productController;
