const { getNamespace } = require("continuation-local-storage");

const { BASE_DB_URI, ADMIN_DB_NAME } = require("./config/env.json");

const { initTenantDbConnection } = require("./db/tenant");
const { initAdminDbConnection } = require("./db/admin");

const tenantService = require("./service/tenant");

let adminDbConnection;
let tenantDbConnection;
let tenantsCache;
/**
 * Create db connections for all the tenants defined in common database
 * this will create buffers for the models for each tenant connection
 **/
const connectAllDb = async () => {
  try {
    let tenants;

    // connect to the tenant-admin db
    const ADMIN_DB_URI = `${BASE_DB_URI}/${ADMIN_DB_NAME}`;
    adminDbConnection = initAdminDbConnection(ADMIN_DB_URI);
    console.log("connectAllDb adminDbConnection", adminDbConnection);

    // connect to test/admin db (base dbs for mongo)
    tenantDbConnection = initTenantDbConnection(BASE_DB_URI);
    console.log("connectAllDb initTenantDbConnection", tenantDbConnection);

    // for each tenant initialize the schemas
    tenants = await tenantService.getAllTenants(adminDbConnection);
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

/**
 * Get the db connection for current context
 * Here we have used a getNamespace from 'continuation-local-storage'
 * This will let us get / set any information and binds the information to current request context
 */
const getConnection = () => {
  const nameSpace = getNamespace("unique context");
  const conn = nameSpace.get("connection");

  if (!conn) {
    throw new Error("Connection is not set for the tenant database");
  }

  return conn;
};

module.exports = {
  connectAllDb,
  getAdminConnection,
  getConnection,
  getConnectionByTenant
};
