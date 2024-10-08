module.exports = (express, app) => {
    const controller = require("../controllers/special.controller.js");
    const router = express.Router();

    router.get("/", controller.all);
    

      // Create a new user.
      router.post("/", controller.create);
      
    // Add routes to server.
    app.use("/api/specials", router);
  };