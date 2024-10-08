module.exports = (express, app) => {
  const controller = require("../controllers/review.controller.js");
  const router = express.Router();

  // Get all reviews for a specific item
  router.get("/:itemID", controller.getByItem);

  // Create a review
  router.post("/", controller.create);

  // Edit a review
  router.put("/:reviewID", controller.update);

  // Delete a review
  router.delete("/:reviewID", controller.delete);

  // Get all reviews
  router.get("/", controller.getAll);

  app.use("/api/reviews", router);
};