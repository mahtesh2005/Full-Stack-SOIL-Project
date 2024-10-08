module.exports = (express, app) => {
    const controller = require("../controllers/follower.controller.js");
    const router = express.Router();
  
    // Follow a user
    router.post("/follow", controller.addFollower);
  
    // Route to get all followed users by a user
    router.get('/followed/:userID', controller.followed);
  
    // Route to unfollow a user   
    router.delete('/unfollow', controller.removeFollower);
  
    // Add routes to server.
    app.use("/api/followers", router);
    
  };