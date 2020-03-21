const TenantModel = require("./schema");

module.exports = class TenantDbModel {
  constructor({ mongooseConnection }) {
    this.mongooseModel = TenantModel(mongooseConnection);
  }

  findAll = async () => {
    try {
      const objects = await this.mongooseModel.find().lean();
      return objects;
    } catch (error) {
      throw error;
    }
  };
  create = async tenant => {
    try {
      const object = await this.mongooseModel.create(tenant).lean();
      return object;
    } catch (error) {
      throw error;
    }
  };
  findByTenantName = async name => {
    try {
      const object = await this.mongooseModel.findOne({ name }).lean();
      return object;
    } catch (error) {
      throw error;
    }
  };
};
