'use strict';
module.exports = (sequelize, DataTypes) => {
  var Posts = sequelize.define('Posts', {
    id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    text: DataTypes.TEXT,
    description: DataTypes.TEXT
  }, {});
  Posts.associate = function(models) {
    // associations can be defined here
  };
  return Posts;
};