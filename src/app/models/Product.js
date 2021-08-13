import Sequelize, { Model } from "sequelize";

class Product extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING(45),
        amount: Sequelize.INTEGER,
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
    this.belongsTo(models.ItemSale, {
      foreignKey: "item_sales_id",
      as: "item_sales",
    });
  }
}

export default Product;
