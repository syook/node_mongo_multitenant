const { getConnection } = require("../../connectionManager");
const userService = require("../../service/user");

const signUp = async (req, res) => {
  try {
    const dbConnection = getConnection();
    console.log("signUp dbConnection", dbConnection.name);
    const user = await userService.createUser(dbConnection, req.body);
    res.status(200).json({ success: true, user });
  } catch (err) {
    console.log("signUp error", err);
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};

const fetchAll = async (req, res) => {
  try {
    const dbConnection = getConnection();
    console.log("fetchAll dbConnection", dbConnection.name);
    const users = await userService.getAllUsers(dbConnection);
    res.status(200).json({ success: true, users });
  } catch (err) {
    console.log("fetchAll error", err);
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};

module.exports = { signUp, fetchAll };
