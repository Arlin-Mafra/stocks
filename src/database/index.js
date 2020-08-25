import Sequelize, { Model } from "sequelize";
import databaseConfig from "../config/database";

import User from "../app/models/User";

const models = [User];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }

  transaction() {
    return this.connection.transaction();
  }
}

export default new Database();
