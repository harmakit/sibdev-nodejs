'use strict';
module.exports = (sequelize, Sequelize) => {
  var user = sequelize.define('user', {
    email: {
      allowNull: false,
      type: Sequelize.STRING
    },
    passwordHash: {
      allowNull: false,
      type: Sequelize.STRING
    },
    name: {
      allowNull: false,
      type: Sequelize.STRING
    },
    admin: {
      allowNull: false,
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  },{
    setterMethods:{
      password: function(value) {
        var salt = bcrypt.genSaltSync();
        var hash = bcrypt.hashSync(value, salt);
        this.setDataValue('passwordHash', hash);
      }
    }
});

  user.prototype.verifyPassword = function(password) {
    return bcrypt.compareSync(password, passwordHash);
  }

  user.associate = function(models) {
    models.user.hasMany(models.post);
  };
  return user;
};
