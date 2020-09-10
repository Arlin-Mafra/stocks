import Sequelize, { Model } from "sequelize";

class Sale extends Model {
  static init(sequelize) {
    super.init(
      {
        description: Sequelize.STRING(100),
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
    this.hasMany(models.ItemSale, {
      foreignKey: "sale_id",
      as: "item_sale",
    });
  }
}

export default Sale;
