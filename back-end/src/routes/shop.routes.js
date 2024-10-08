module.exports = (express, app) => {
  const controller = require("../controllers/shop.controller.js");
  const router = express.Router();

  router.get("/", controller.all);

  // Add route to add an item to the cart
  router.post("/add", controller.addToCart);

  // Add route to remove an item from the cart
  router.post("/remove", controller.removeFromCart);

  router.get("/getCart/:userID", controller.getCart);
  
  // Route to clear the cart
  router.delete("/clear/:userID", controller.clearCart);

  // Add routes to server
  app.use("/api/shops", router);
};
