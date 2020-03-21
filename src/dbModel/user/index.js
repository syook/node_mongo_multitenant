const UserModel = require("./schema");

module.exports = class UserDbModel {
  constructor({ mongooseConnection }) {
    this.mongooseModel = UserModel(mongooseConnection);
  }
  findAll = async () => {
    try {
      const objects = await this.mongooseModel.find().lean();
      return objects;
    } catch (error) {
      throw error;
    }
  };
  create = async user => {
    try {
      const object = await this.mongooseModel.create(user).lean();
      return object;
    } catch (error) {
      throw error;
    }
  };
};
