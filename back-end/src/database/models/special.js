module.exports = (sequelize, DataTypes) => {
    // Drop the table if it exists.
    sequelize.query('DROP TABLE IF EXISTS specials');
  
    // Define the special model.
    const Special = sequelize.define("special", {
      itemID: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      item_name: {
        type: DataTypes.STRING(32),
        allowNull: false
      },
      original_price: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      item_price: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      category: {
        type: DataTypes.STRING(32),
        allowNull: false
      }, 
      item_image: {
        type: DataTypes.STRING(500),
        allowNull: false
      },
    }, {
      // Don't add the timestamp attributes (updatedAt, createdAt).
      timestamps: false
    });
  
    // Return the model.
    return Special;
  };
  