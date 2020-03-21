const { asValue } = require("awilix");

const {
  getConnectionByTenant,
  getAdminConnection
} = require("../connectionManager");

const { mainThreadContainerScope } = require("../service/mainThread");

/**
 * Get the connection instance for the given tenant's name and set it to the current context.
 */
const resolveTenant = (req, res, next) => {
  const tenant = req.headers.tenant;

  if (!tenant) {
    return res.status(500).json({
      error: `Please provide tenant's name to connect`
    });
  }

  // get the tenant db connection
  const tenantDbConnection = getConnectionByTenant(tenant);
  console.log(
    "resolveTenant tenantDbConnection",
    tenantDbConnection && tenantDbConnection.name
  );

  // create a scoped container
  req.container = mainThreadContainerScope();

  // set mongooseConnection in awilix
  req.container.register({
    mongooseConnection: asValue(tenantDbConnection)
  });

  next();
};

/**
 * Get the admin db connection instance and set it to the current context.
 */
const setAdminDb = (req, res, next) => {
  // get the admin db connection
  const adminDbConnection = getAdminConnection();
  console.log("setAdminDb adminDbConnection", adminDbConnection.name);

  // create a scoped container
  req.container = mainThreadContainerScope();

  // set mongooseConnection in awilix
  req.container.register({
    mongooseConnection: asValue(adminDbConnection)
  });

  next();
};

module.exports = { resolveTenant, setAdminDb };
