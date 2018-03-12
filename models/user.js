'use strict';
var bcrypt = require('bcrypt');

module.exports = (sequelize, Sequelize) => {
  var user = sequelize.define('user', {
    username: {
      type: Sequelize.STRING,
      allowNull: false
    },
    passwordHash: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      allowNull: false,
      type: Sequelize.STRING
    },
    admin: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    setterMethods: {
      password: function(value) {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(value, salt);
        this.setDataValue('passwordHash', hash);
      }
    }
  });

  user.prototype.verifyPassword = function(password){
  return bcrypt.compareSync(password, this.passwordHash);
  };

  user.associate = function(models) {
    user.hasMany(models.post);
  };

  return user;
};
