module.exports = (express, app) => {
    const controller = require("../controllers/profile.controller.js");
    const router = express.Router();
  
    router.get("/", controller.all)

    router.get("/select/:userID", controller.one);

    router.post("/", controller.create)
    
    // Add routes to server.
    app.use("/api/profiles", router);
  };
  