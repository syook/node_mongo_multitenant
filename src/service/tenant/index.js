module.exports = class TenantService {
  constructor({ tenantDbModel, BASE_DB_URI }) {
    this.tenantDbModel = tenantDbModel;
    this.BASE_DB_URI = BASE_DB_URI;
  }
  fetchAll = async () => {
    try {
      const tenants = await this.tenantDbModel.findAll();
      console.log("tenantService/fetchAll", tenants);
      return tenants;
    } catch (error) {
      console.error("tenantService/fetchAll", error);
      throw error;
    }
  };

  create = async body => {
    try {
      const name = body.name;
      const dbName = `mt_${name}`;
      const tenantPresent = await this.tenantDbModel.findByTenantName(name);
      if (tenantPresent) {
        throw new Error("Tenant Already Present");
      }
      const newTenant = await this.tenantDbModel.create({
        name,
        dbName,
        dbURI: `${this.BASE_DB_URI}/${dbName}`
      });

      // TODO: emit event to connectAllDb and cache new tenant's db connection
      return newTenant;
    } catch (error) {
      console.log("tenantService/create", error);
      throw error;
    }
  };
};

// const { BASE_DB_URI } = require("../../config/env.json");

// const getAllTenants = async adminDbConnection => {
//   try {
//     const Tenant = await adminDbConnection.model("Tenant");
//     const tenants = await Tenant.find({});
//     console.log("getAllTenants tenants", tenants);
//     return tenants;
//   } catch (error) {
//     console.log("getAllTenants error", error);
//     throw error;
//   }
// };

// const createTenant = async (adminDbConnection, body) => {
//   try {
//     const Tenant = await adminDbConnection.model("Tenant");
//     const name = body.name;
//     const dbName = `mt_${name}`;
//     const tenantPresent = await Tenant.findOne({ name });
//     if (tenantPresent) {
//       throw new Error("Tenant Already Present");
//     }
//     const newTenant = await new Tenant({
//       name,
//       dbName,
//       dbURI: `${BASE_DB_URI}/${dbName}`
//     }).save();

//     // TODO: emit event to connectAllDb and cache new tenant's db connection
//     return newTenant;
//   } catch (error) {
//     console.log("createTenant error", error);
//     throw error;
//   }
// };

// module.exports = { getAllTenants, createTenant };
