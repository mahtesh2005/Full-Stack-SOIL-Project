module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define("order", {
        cartID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        userID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'userID'
            },
        },
        itemID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        itemName: {
            type: DataTypes.STRING(32),
            allowNull: false
        },
        itemPrice: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        itemQuantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        totalPrice: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
    }, {
        timestamps: false
    });

    return Order;
};
