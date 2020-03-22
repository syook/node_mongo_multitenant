const { asValue } = require("awilix");

const {
  getConnectionByTenant,
  getAdminConnection
} = require("../db/connectionManager");

const { mainThreadContainerScope } = require("../service/mainThread");

/**
 * Get the connection instance for the given tenant's name and set it to the current context.
 */
const resolveTenant = async (req, res, next) => {
  // validate header for tenant field
  const tenant = req.headers.tenant;
  if (!tenant) {
    return res.status(500).json({ error: "tenant not found in header" });
  }

  // get the tenant db connection
  const tenantDbConnection = await getConnectionByTenant(tenant);
  console.log(
    "resolveTenant tenantDbConnection",
    tenantDbConnection && tenantDbConnection.name
  );

  // if no tenant db connection resolved then tenant name was invalid
  if (!tenantDbConnection) {
    return res.status(500).json({ error: "tenant db connection not found" });
  }

  // create a scoped container
  req.container = mainThreadContainerScope();

  // set mongooseConnection in awilix
  req.container.register({ mongooseConnection: asValue(tenantDbConnection) });

  next();
};

/**
 * Get the admin db connection instance and set it to the current context.
 */
const setAdminDb = (req, res, next) => {
  // get the admin db connection
  const adminDbConnection = getAdminConnection();
  console.log("setAdminDb adminDbConnection", adminDbConnection.name);

  if (!adminDbConnection) {
    return res.status(500).json({ error: "adming db connection not found" });
  }

  // create a scoped container
  req.container = mainThreadContainerScope();

  // set mongooseConnection in awilix
  req.container.register({ mongooseConnection: asValue(adminDbConnection) });

  next();
};

module.exports = { resolveTenant, setAdminDb };
