module.exports = (express, app) => {
  const controller = require("../controllers/standard.controller.js");
  const router = express.Router();

  router.get("/", controller.all);

  // Create a new item.
  router.post("/", controller.create);

  // Route to fetch all fruit items
  router.get("/fruits", controller.fruitItems);

  // Route to fetch all fruit items
  router.get("/vegetables", controller.vegetableItems);

  // Route to fetch all fruit items
  router.get("/pantrystaples", controller.pantry_staplesItems);

  // Route to fetch all fruit items
  router.get("/nuts&grains", controller.nuts_grainsItems);

  // Add routes to server.
  app.use("/api/standards", router);
};