const db = require("../database");

exports.all = async (req, res) => {
    const profiles = await db.profile.findAll();
  
    res.json(profiles);
  };

// Select one profile from the database based on userID.
exports.one = async (req, res) => {
    try {
        const { userID } = req.params;
        const profile = await db.profile.findOne({ where: { userID } });
        res.json(profile);
    } catch (error) {
        console.error('Error retrieving profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Create a profile in the database.
exports.create = async (req, res) => {
    try {
      const { username, dateOfJoining, userID, userRole, numFollowers, numFollowing} = req.body;
  
      const profile = await db.profile.create({
          username: username,
          userID: userID, // Use the retrieved user ID
          dateOfJoining: dateOfJoining,
          userRole: userRole,
          numFollowers: numFollowers,
          numFollowing: numFollowing
      });
    
      // Send the newly created profile as JSON response
      res.json(profile);
    } catch (error) {
      console.error('Error creating profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };


  