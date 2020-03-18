const { BASE_DB_URI } = require("../../config/env.json");

const getAllTenants = async adminDbConnection => {
  try {
    const Tenant = await adminDbConnection.model("Tenant");
    const tenants = await Tenant.find({});
    console.log("getAllTenants tenants", tenants);
    return tenants;
  } catch (error) {
    console.log("getAllTenants error", error);
    throw error;
  }
};

const createTenant = async (adminDbConnection, body) => {
  try {
    const Tenant = await adminDbConnection.model("Tenant");
    const name = body.name;
    const dbName = `mt_${name}`;
    const tenantPresent = await Tenant.findOne({ name });
    if (tenantPresent) {
      throw new Error("Tenant Already Present");
    }
    const newTenant = await new Tenant({
      name,
      dbName,
      dbURI: `${BASE_DB_URI}/${dbName}`
    }).save();

    // TODO: emit event to connectAllDb and cache new tenant's db connection
    return newTenant;
  } catch (error) {
    console.log("createTenant error", error);
    throw error;
  }
};

module.exports = { getAllTenants, createTenant };
