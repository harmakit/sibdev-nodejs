'use strict';
module.exports = (sequelize, DataTypes) => {
  var Users = sequelize.define('Users', {
    id: DataTypes.INT,
    email: DataTypes.STRING,
    passwordHash: DataTypes.STRING,
    name: DataTypes.STRING,
    admin: DataTypes.BOOLEAN
  }, {});
  Users.associate = function(models) {
    // associations can be defined here
  };
  return Users;
};