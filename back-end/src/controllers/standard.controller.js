const db = require("../database");

// Select all standard items from the database.
exports.all = async (req, res) => {
    const standards = await db.standard.findAll();
  
    res.json(standards);
  };
  
// Create a standard item in the database.
exports.create = async (req, res) => {
    const standards = await db.standard.create({
      itemID: req.body.itemID, 
      item_name: req.body.item_name,
      item_price: req.body.item_price,
      category: req.body.category,
      item_image: req.body.image_url
    });
  
    res.json(standards);
  };

  // Select all fruit items from the database.
exports.fruitItems = async (req, res) => {
  const fruits = await db.standard.findAll({
      where: {
          category: "Fruits"
      }
  });

  res.json(fruits);
};

  // Select all vegetables items from the database.
  exports.vegetableItems = async (req, res) => {
    const vegetables = await db.standard.findAll({
        where: {
            category: "Vegetables"
        }
    });
  
    res.json(vegetables);
  };

    // Select all pantry staples items from the database.
exports.pantry_staplesItems = async (req, res) => {
  const pantry_staples = await db.standard.findAll({
      where: {
          category: "Pantry Staples"
      }
  });

  res.json(pantry_staples);
};

  // Select all nuts & grains items from the database.
  exports.nuts_grainsItems = async (req, res) => {
    const nuts_grains = await db.standard.findAll({
        where: {
            category: "Nuts & Grains"
        }
    });
  
    res.json(nuts_grains);
  };

