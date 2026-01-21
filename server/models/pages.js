'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Pages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Pages.hasMany(models.PageContents, {
      //   foreignKey: 'pageId',
      //   as: 'pageContents',
      //   onDelete: 'CASCADE',
      //   onUpdate: 'CASCADE',
      // })
    }
  }
  Pages.init(
    {
      title: DataTypes.STRING,
      slug: DataTypes.STRING,
      children: DataTypes.JSON,
      icon: DataTypes.STRING,
      orderIndex: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Pages',
      timestamps: true,
    },
  )
  return Pages
}
