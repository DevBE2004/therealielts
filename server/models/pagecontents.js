'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class PageContents extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PageContents.belongsTo(models.Common, {
        foreignKey: 'pageId',
        as: 'page',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    }
  }
  PageContents.init(
    {
      pageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Common',
          key: 'id',
        },
      },
      orderIndex: DataTypes.INTEGER,
      images: DataTypes.JSON,
      text: DataTypes.TEXT,
      textPosition: {
        type: DataTypes.ENUM,
        values: ['left', 'right'],
        allowNull: false,
        defaultValue: 'left',
      },
    },
    {
      sequelize,
      modelName: 'PageContents',
      timestamps: true,
    },
  )
  return PageContents
}
