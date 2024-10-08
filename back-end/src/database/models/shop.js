module.exports = (sequelize, DataTypes) => {
  const shop = sequelize.define(
    "shop", // Table name
    {
      userID: {
        type: DataTypes.STRING(32),
        allowNull: false,
        primaryKey: true,
      },
      itemID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      itemName: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
      itemPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      itemQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      totalPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      itemImage: {
        type: DataTypes.STRING(300),
        allowNull: false,
      },
    },
    {
      timestamps: false, // Disable timestamps (createdAt and updatedAt)
      tableName: "ShoppingCart", // Set the table name to "cart"
    }
  );

  return shop;
};
