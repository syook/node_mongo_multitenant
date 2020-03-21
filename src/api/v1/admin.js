const create = async (req, res) => {
  try {
    const tenantService = req.container.resolve("tenantService");
    console.log("tenantService", tenantService);
    const tenant = await tenantService.create(req.body);
    res.status(200).json({ success: true, tenant });
  } catch (err) {
    console.log("signUp error", err);
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};

const fetchAll = async (req, res) => {
  try {
    const tenantService = req.container.resolve("tenantService");
    console.log("tenantService", tenantService);
    const tenants = await tenantService.fetchAll();
    res.status(200).json({ success: true, tenants });
  } catch (err) {
    console.log("fetchAll error", err);
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};

module.exports = { create, fetchAll };
