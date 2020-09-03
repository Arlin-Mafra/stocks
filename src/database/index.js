import Sequelize, { Model } from "sequelize";
import databaseConfig from "../config/database";

import User from "../app/models/User";
import Product from "../app/models/Product";
import Category from "../app/models/Category";
import Attachment from "../app/models/Attachment";
import Client from "../app/models/Client";
import Sale from "../app/models/Sale";

const models = [User, Category, Product, Attachment, Client, Sale];

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
