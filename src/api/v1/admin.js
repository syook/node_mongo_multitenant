const { getConnection } = require("../../connectionManager");
const tenantService = require("../../service/tenant");

const create = async (req, res) => {
  try {
    const dbConnection = getConnection();
    console.log("create dbConnection", dbConnection.name);
    const tenant = await tenantService.createTenant(dbConnection, req.body);
    res.status(200).json({ success: true, tenant });
  } catch (err) {
    console.log("signUp error", err);
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};

const fetchAll = async (req, res) => {
  try {
    const dbConnection = getConnection();
    console.log("fetchAll dbConnection", dbConnection.name);
    const tenants = await tenantService.getAllTenants(dbConnection);
    res.status(200).json({ success: true, tenants });
  } catch (err) {
    console.log("fetchAll error", err);
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};

module.exports = { create, fetchAll };
