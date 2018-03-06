'use strict';
module.exports = (sequelize, DataTypes) => {
  var user = sequelize.define('user', {
    email: DataTypes.STRING,
    passwordHash: DataTypes.STRING,
    name: DataTypes.STRING,
    admin: DataTypes.BOOLEAN
  }, {});
  user.associate = function(models) {
    models.user.belongsTo(models.post, {
      });
  };
  return user;
};
