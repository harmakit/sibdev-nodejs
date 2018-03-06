'use strict';
module.exports = (sequelize, DataTypes) => {
  var post = sequelize.define('post', {
    title: DataTypes.STRING,
    text: DataTypes.TEXT,
    description: DataTypes.TEXT
  }, {});
  post.associate = function(models) {
    models.post.belongsTo(models.user, {
      });
  };
  return post;
};
