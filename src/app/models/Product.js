import Sequelize, { Model } from "sequelize";

class Product extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING(45),
        amount: Sequelize.INTEGER,
        attachment_id: Sequelize.INTEGER,
      },
      { sequelize }
    );

    return this;
  }
  static associate(models) {
    this.belongsTo(models.Category, {
      as: "categories",
      foreignKey: "category_id",
    });
    this.belongsTo(models.Attachment, {
      as: "attachments",
      foreignKey: "attachment_id",
    });
    this.hasOne(models.ItemSale, {
      foreignKey: "product_id",
      as: "item_sale",
    });
  }
}

export default Product;
