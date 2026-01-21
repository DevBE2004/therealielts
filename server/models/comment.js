'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Comment.belongsTo(models.User, {
      //   foreignKey: 'authorId',
      //   as: 'author',
      //   onDelete: 'CASCADE',
      //   onUpdate: 'CASCADE',
      // })
    }
  }
  Comment.init(
    {
      // authorId: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   references: {
      //     model: 'User',
      //     key: 'id',
      //   },
      // },
      avatar: DataTypes.STRING,
      name: DataTypes.STRING,
      job: DataTypes.STRING,
      content: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'Comment',
      timestamps: true,
    },
  )
  return Comment
}
