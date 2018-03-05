'use strict';
module.exports = (sequelize, DataTypes) => {
  var Users = sequelize.define('Users', {
    id: DataTypes.INTEGER,
    email: DataTypes.STRING,
    passwordHash: DataTypes.STRING,
    name: DataTypes.STRING,
    admin: DataTypes.BOOLEAN
  }, {});
  Users.associate = function(models) {
    Users.hasMany(models.posts, {
        foreignKey: "userId",
        sourceKey: "id"
      });
  };
  return Users;
};
