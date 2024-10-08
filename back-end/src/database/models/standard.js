module.exports = (sequelize, DataTypes) => {
    // Drop the table if it exists.
    sequelize.query('DROP TABLE IF EXISTS standards');

    const Standard = sequelize.define("standard", {
      itemID: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      item_name: {
        type: DataTypes.STRING(32),
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
  

return Standard;
};

