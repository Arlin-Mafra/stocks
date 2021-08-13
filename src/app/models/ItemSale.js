import Sequelize, { Model } from "sequelize";

class ItemSale extends Model {
  static init(sequelize) {
    super.init(
      {
        amount: Sequelize.INTEGER,
      },
      { sequelize }
    );

    return this;
  }
  static associate(models) {
    this.hasMany(models.Product, {
      foreignKey: "product_id",
      as: "products",
    });
    this.belongsTo(models.Sale, {
      foreignKey: "sale_id",
      as: "sale",
    });
  }
}

export default ItemSale;
