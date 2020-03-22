/**
 * require this file in the main process
 * call the connectAllDb to initialize db connections on that thread
 * import getConnectionByTenant, getAdminConnection anywhere in that thread to get the reuqired db connections of that thread
 */

const { BASE_DB_URI, ADMIN_DB_NAME } = require("../config/env.json");

const { initTenantDbConnection } = require("./tenant");
const { initAdminDbConnection } = require("./admin");

const TenantDbModel = require("../dbModel/tenant");

let adminDbConnection;
let tenantDbConnection;
let tenantsCache;

const setTenantCache = tenants => {
  // set tenantCache
  tenantsCache = tenants
    .map(tenant => {
      const tenantDb = tenantDbConnection.useDb(tenant.dbName);
      console.log(
        "setTenantCache tenantDbConnection",
        tenantDb && tenantDb.name
      );

      return {
        [tenant.name]: tenant
      };
    })
    .reduce((prev, next) => {
      return Object.assign({}, prev, next);
    }, {});
  console.log("setTenantCache tenantsCache", tenantsCache);
};

/**
 * Create db connections for all the tenants defined in common database
 * this will create buffers for the models for each tenant connection
 **/
const connectAllDb = async () => {
  try {
    // connect to the tenant-admin db
    const ADMIN_DB_URI = `${BASE_DB_URI}/${ADMIN_DB_NAME}`;
    adminDbConnection = initAdminDbConnection(ADMIN_DB_URI);
    console.log("connectAllDb adminDbConnection", adminDbConnection);

    // connect to test/admin db (base dbs for mongo)
    tenantDbConnection = initTenantDbConnection(BASE_DB_URI);
    console.log("connectAllDb initTenantDbConnection", tenantDbConnection);

    // fetch all tenants
    const tenantDbModel = new TenantDbModel({
      mongooseConnection: adminDbConnection
    });
    const tenants = await tenantDbModel.findAll();
    console.log("tenants", tenants);

    // set the tenantCache with each tenant's details
    setTenantCache(tenants);
  } catch (e) {
    console.log("connectAllDb error", e);
    return;
  }
};

/**
 * Get the db connection for the given tenant
 */
const getConnectionByTenant = async tenantName => {
  try {
    // find the tenant in the tenantCache
    if (tenantDbConnection && tenantsCache[tenantName]) {
      const tenantDb = tenantDbConnection.useDb(
        tenantsCache[tenantName].dbName
      );
      console.log(
        "getConnectionByTenant tenantDbConnection",
        tenantDb && tenantDb.name
      );
      return tenantDb;
    }

    // if tenant not found in the cache, try to see if tenant exists
    // connect to the tenant-admin db
    const adminDbConnection = getAdminConnection();
    console.log(
      "getConnectionByTenant adminDbConnection",
      adminDbConnection.name
    );

    // fetch all tenants
    const tenantDbModel = new TenantDbModel({
      mongooseConnection: adminDbConnection
    });
    const tenants = await tenantDbModel.findAll();
    console.log("tenants", tenants);

    // if tenant found, then reset tenantCache
    if (tenants.find(t => t.name === tenantName)) setTenantCache(tenants);

    // return the tenant db connection
    if (tenantDbConnection && tenantsCache[tenantName]) {
      const tenantDb = tenantDbConnection.useDb(
        tenantsCache[tenantName].dbName
      );
      console.log(
        "getConnectionByTenant tenantDbConnection",
        tenantDb && tenantDb.name
      );
      return tenantDb;
    }

    return null;
  } catch (e) {
    console.log("getConnectionByTenant error", e);
    return null;
  }
};

/**
 * Get the admin db connection
 */
const getAdminConnection = () => {
  if (adminDbConnection) {
    console.log("getAdminConnection adminDbConnection", adminDbConnection.name);
    return adminDbConnection;
  }
};

module.exports = {
  connectAllDb,
  getAdminConnection,
  getConnectionByTenant
};
