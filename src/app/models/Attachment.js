import Sequelize, { Model } from "sequelize";

class Attachment extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        file: Sequelize.STRING,

        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `http://localhost:3333/attachments/${this.file}`;
          },
        },
      },
      { sequelize }
    );

    return this;
  }
}

export default Attachment;
