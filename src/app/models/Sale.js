import Sequelize, { Model } from "sequelize";

class Sale extends Model {
  static init(sequelize) {
    super.init(
      {
        description: Sequelize.STRING(100),
        amount: Sequelize.INTEGER,
      },
      { sequelize }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    }),
      this.belongsTo(models.Client, {
        foreignKey: "client_id",
        as: "client",
      });
    this.belongsTo(models.Product, {
      through: "sales_products",
      foreignKey: "product_id",
      as: "product",
    });
  }
}

export default Sale;
