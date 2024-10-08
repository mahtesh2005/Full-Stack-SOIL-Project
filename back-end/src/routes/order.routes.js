module.exports = (express, app) => {
  const controller = require("../controllers/order.controller.js");
  const router = express.Router();

  // Get all orders.
  router.get("/", controller.all);

  // Get all orders by userID.
  router.get("/:userID", controller.id)

  // Create a new order.
  router.post("/submit", controller.submitOrder);

  // Add routes to server.
  app.use("/api/orders", router);
  
};

