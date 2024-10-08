module.exports = (express, app) => {
  const controller = require("../controllers/user.controller.js");
  const router = express.Router();

  const { signUpValidation, loginValidation } = require('../middleware/validationMiddleware.js');

  // Select all users.
  router.get("/", controller.all);

  // Select a single user with a key ie username or email.
  router.get("/select/:key/:value", controller.one);

  // Select one user from the database if username and password are a match.
  router.get("/login", loginValidation, controller.login);

  // Create a new user.
  router.post("/", signUpValidation, controller.create);

  // Delete a user
  router.delete("/:username", controller.delete);

  // Update a current user
  router.put("/:userID", controller.update);
  
  // Add routes to server.
  app.use("/api/users", router);
};
