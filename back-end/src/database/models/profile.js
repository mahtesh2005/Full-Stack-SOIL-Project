module.exports = (sequelize, DataTypes) => 
  sequelize.define("profile", {
    userID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'users',
        key: 'userID'
      },
    },
    dateOfJoining: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
  }, {
    timestamps: false, // Don't add the timestamp attributes (updatedAt, createdAt).
  });