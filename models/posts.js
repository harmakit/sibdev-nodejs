'use strict';
module.exports = (sequelize, DataTypes) => {
  var Posts = sequelize.define('Posts', {
    id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    text: DataTypes.TEXT,
    description: DataTypes.TEXT,
    userId: DataTypes.INTEGER
  }, {});
  Posts.associate = function(models) {
    Posts.belongsTo(models.users, {
        foreignKey: "userId",
        sourceKey: "id"
      });
  };
  return Posts;
};
