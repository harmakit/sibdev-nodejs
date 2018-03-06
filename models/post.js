'use strict';
module.exports = (sequelize, Sequelize) => {
  var post = sequelize.define('post', {
    title: {
      allowNull: false,
      type: Sequelize.STRING
    },
    text: {
      allowNull: false,
      type: Sequelize.TEXT
    },
    description: {
      allowNull: false,
      type: Sequelize.TEXT
    }
  }, {});
  post.associate = function(models) {
    models.post.belongsTo(models.user);
  };
  return post;
};
