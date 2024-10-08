module.exports = (sequelize, DataTypes) =>
  sequelize.define("follower", {
    followerID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'userID'
      }
    },
    followedID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'userID'
      }
    }
  }, {
    timestamps: false
  });
