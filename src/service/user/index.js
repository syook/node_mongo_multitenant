const bcrypt = require("bcryptjs");

const getAllUsers = async tenantDbConnection => {
  try {
    const User = await tenantDbConnection.model("User");
    const users = await User.find({});
    console.log("getAllUsers users", users);
    return users;
  } catch (error) {
    console.log("getAllUsers error", error);
    throw error;
  }
};

const createUser = async (tenantDbConnection, body) => {
  try {
    const User = await tenantDbConnection.model("User");
    const phoneNumber = body.phoneNumber;
    const password = body.password;
    const email = body.email;
    const name = body.name;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userPresent = await User.findOne({
      phoneNumber
    });
    if (userPresent) {
      throw new Error("User Already Present");
    }
    const newUser = await new User({
      phoneNumber: phoneNumber,
      password: hashedPassword,
      email,
      name
    }).save();
    return newUser;
  } catch (error) {
    console.log("createUser error", error);
    throw error;
  }
};

module.exports = { getAllUsers, createUser };
