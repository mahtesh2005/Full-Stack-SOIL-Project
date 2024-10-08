const db = require("../database");

// Controller To Add follower
exports.addFollower = async (req, res) => {
    try {
      const { followerID, followedID } = req.body;
      await db.follower.create({ followerID, followedID });
      res.json({ message: "Follow successful" });
    } catch (error) {
      console.error('Error adding follower:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  // Get all followed users by a user
  exports.followed = async (req, res) => {
    try {
      const userID = req.params.userID;
      const followed = await db.follower.findAll({ where: { followerID: userID }, attributes: ['followedID'] });
      const followedIDs = followed.map(item => item.followedID);
      res.status(200).json({ success: true, followedIDs });
    } catch (err) {
      console.error("Error retrieving followed users:", err);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  
  // Unfollow a user
  exports.removeFollower = async (req, res) => {
    
    try {
      const { followerID, followedID } = req.query;
        
      console.log(followerID, followedID)
      const result = await db.follower.destroy({ where: { followerID, followedID } });
      if (result === 1) {
        res.status(200).json({ success: true, message: "Follower removed successfully" });
      } else {
        res.status(404).json({ success: false, message: "Follower not found" });
      }
    } catch (err) {
      console.error("Error removing follower:", err);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };