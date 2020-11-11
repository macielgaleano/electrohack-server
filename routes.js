const express = require("express");
const router = express.Router();
const authController = require("./controllers/authController");
const orderController = require("./controllers/orderController");
const productController = require("./controllers/productController");
const userController = require("./controllers/userController");
const adminController = require("./controllers/adminController");
const categoryController = require("./controllers/categoryController");
const checkJwt = require("express-jwt");
const seeder = require("./seeder");

// REGISTRO //

router.get("/data", seeder.createData);

router.post("/token/registro", authController.register);
router.post("/token/login", authController.login);
router.patch("/logout", authController.logout);
// router.delete("/token", authController.delete);

// PUBLICAS //

router.get("/productos", productController.all);
router.get("/productos/:slug", productController.show);
router.get("/productos/lista/categorias", categoryController.show);
router.get(
  "/productos/categorias/:categoria",
  productController.showByCategory
);

// MIDDLEWARE JWT //

router.use(checkJwt({ secret: process.env.SECRET, algorithms: ["HS256"] }));

// PRIVADAS //

// router.get("/api/usuarios", userController.show);
// router.get("/api/usuarios/:id", userController.showById);
// router.post("/api/usuarios", userController.store);
// router.put("/api/usuarios", userController.update);
// router.put("/api/usuarios/password", userController.updatePassword);
router.delete("/api/usuarios", userController.delete);
// router.post("/api/pedidos", orderController.store);

// MIDDLEWARE CHECK ADMIN //

// aca iria el middleware que chequea si el usuario es admin //

// ADMIN //

// router.post("/api/admin", adminController.store);
// router.delete("/api/admin", adminController.delete);
// router.put("/api/admin/password", adminController.updatePassword);
// router.put("/api/admin", adminController.update);

//PRODUCTOS //

router.post("/api/admin/productos", productController.store);
router.put("/api/admin/productos", productController.update);
router.delete("/api/admin/productos", productController.delete);
router.patch("/api/admin/productos", productController.updateImage);

// PEDIDOS //

// router.put("/api/admin/pedidos", orderController.updateState);

module.exports = router;
