const db = require("../database");
const argon2 = require("argon2");

// Select all users from the database.
exports.all = async (req, res) => {
  const users = await db.user.findAll();

  res.json(users);
};

// Select one user from the database based on a key.
exports.one = async (req, res) => {
  const { key, value } = req.params;
  let user;
  if (key === "username") {
      user = await db.user.findOne({ where: { username: value } });
  } else if (key === "email") {
      user = await db.user.findOne({ where: { email: value } });
  } else if (key === "id"){
    user = await db.user.findByPk(value)
  }
  res.json(user);
};

// Select one user from the database if username and password are a match.
exports.login = async (req, res) => {
  const user = await db.user.findOne({ where: { email: req.query.email } });

  if(user === null || await argon2.verify(user.password_hash, req.query.password) === false)
    // Login failed.
    res.json(null);
  else
    res.json(user);
};

// Create a user in the database.
exports.create = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Hash the password using argon2
    const hash = await argon2.hash(password, { type: argon2.argon2id });

    // Create a new user in the database
    const user = await db.user.create({
      username: username,
      password_hash: hash,
      email: email
    });

    // Send the newly created user as JSON response
    res.json({ user: user, userID: user.userID });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a user from the database
exports.delete = async (req, res) => {
  try {
      const { username } = req.params;
      await db.user.destroy({ where: { username } });
      res.json({ message: "User deleted successfully" });
  } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};

exports.update = async (req, res) => {
  try {
    const { userID } = req.params;
    const { username, email, password } = req.body;

    console.log(req.body)

    // Hash the new password if it's provided
    let updatedFields = { username, email };
    if (password) {
      const hash = await argon2.hash(password, { type: argon2.argon2id });
      updatedFields.password_hash = hash;
    }

    const [updated] = await db.user.update(updatedFields, { where: { userID } });

    if (updated) {
      const updatedUser = await db.user.findOne({ where: { userID } });
      res.json(updatedUser); // Return the updated user data
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
