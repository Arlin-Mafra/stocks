import Sequelize, { Model } from "sequelize";

class Category extends Model {
  static init(sequelize) {
    super.init(
      {
        description: Sequelize.STRING(45),
      },
      { sequelize }
    );

    return this;
  }
  static associate(models) {}
}

export default Category;
