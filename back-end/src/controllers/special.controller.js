const db = require("../database");

// Select all users from the database.
exports.all = async (req, res) => {
    const specials = await db.special.findAll();
  
    res.json(specials);
  };
  
// Create a special in the database.
exports.create = async (req, res) => {
    const specials = await db.special.create({
      itemID: req.body.itemID,
      item_name: req.body.item_name,
      original_price: req.body.original_price,
      item_price: req.body.item_price,
      category: req.body.category
    });
  
    res.json(specials);
  };
