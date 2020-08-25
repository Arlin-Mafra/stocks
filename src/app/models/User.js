import Sequelize, { Model } from "sequelize";
import bcrypt from "bcryptjs";

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        username: Sequelize.STRING(45),
        email: Sequelize.STRING(100),
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
      },

      {
        sequelize,
      }
    );

    // Hooks
    this.addHook("beforeSave", async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    User.prototype.checkPassword = function (password) {
      return bcrypt.compare(password, this.password_hash);
    };

    return this;
  }

  static associate(models) {}
}

export default User;
