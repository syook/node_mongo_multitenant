/**
 * require this file in the main process
 * instantiate a container for that process
 * inject the container into connectAllDb to initialize db connection on that thread
 * import getConnectionByTenant, getAdminConnection anywhere in that thread to get the reuqired db connections of that thread
 */

const { asValue } = require("awilix");

const { BASE_DB_URI, ADMIN_DB_NAME } = require("./config/env.json");

const { initTenantDbConnection } = require("./db/tenant");
const { initAdminDbConnection } = require("./db/admin");

let adminDbConnection;
let tenantDbConnection;
let tenantsCache;

/**
 * Create db connections for all the tenants defined in common database
 * this will create buffers for the models for each tenant connection
 **/
const connectAllDb = async container => {
  try {
    let tenants;

    // connect to the tenant-admin db
    const ADMIN_DB_URI = `${BASE_DB_URI}/${ADMIN_DB_NAME}`;
    adminDbConnection = initAdminDbConnection(ADMIN_DB_URI);
    console.log("connectAllDb adminDbConnection", adminDbConnection);

    // set db in container scope
    container.register({
      mongooseConnection: asValue(adminDbConnection)
    });

    // connect to test/admin db (base dbs for mongo)
    tenantDbConnection = initTenantDbConnection(BASE_DB_URI);
    console.log("connectAllDb initTenantDbConnection", tenantDbConnection);

    // for each tenant initialize the schemas
    const tenantService = container.resolve("tenantService");
    tenants = await tenantService.fetchAll();
    console.log("connectAllDb tenants", tenants);

    tenantsCache = tenants
      .map(tenant => {
        const tenantDb = tenantDbConnection.useDb(tenant.dbName);
        console.log("connectAllDb tenantDbConnection", tenantDb);

        return {
          [tenant.name]: tenant
        };
      })
      .reduce((prev, next) => {
        return Object.assign({}, prev, next);
      }, {});
    console.log("connectAllDb tenantsCache", tenantsCache);
  } catch (e) {
    console.log("connectAllDb error", e);
    return;
  }
};

/**
 * Get the db connection for the given tenant
 */
const getConnectionByTenant = tenantName => {
  if (tenantDbConnection && tenantsCache[tenantName]) {
    const tenantDb = tenantDbConnection.useDb(tenantsCache[tenantName].dbName);
    console.log("getConnectionByTenant tenantDbConnection", tenantDb.name);
    return tenantDb;
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
