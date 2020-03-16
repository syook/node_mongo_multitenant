const express = require("express");

// connection resolver for tenant
const connectionResolver = require("../../middlewares/connectionResolver");

// Mounting routes
const v1Routes = express.Router();

v1Routes.use("/tenant", connectionResolver.resolveTenant);
v1Routes.use("/admin", connectionResolver.setAdminDb);

// admin
const adminApi = require("./admin");
v1Routes.post("/admin/tenant", adminApi.create);
v1Routes.get("/admin/tenant", adminApi.fetchAll);

// user
const userApi = require("./user");
v1Routes.post("/tenant/user/signup", userApi.signUp);
v1Routes.get("/tenant/user", userApi.fetchAll);

module.exports = v1Routes;
