const bcrypt = require("bcryptjs");

module.exports = class UserService {
  constructor({ userDbModel }) {
    this.userDbModel = userDbModel;
  }
  fetchAll = async () => {
    try {
      const users = await this.userDbModel.findAll();
      console.log("userService/fetchAll", users);
      return users;
    } catch (error) {
      console.error("userService/fetchAll", error);
      throw error;
    }
  };

  create = async body => {
    try {
      const phoneNumber = body.phoneNumber;
      const password = body.password;
      const email = body.email;
      const name = body.name;

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const userPresent = await this.userDbModel.findByPhoneNumber(phoneNumber);
      if (userPresent) {
        throw new Error("User Already Present");
      }
      const newUser = await this.userDbModel.create({
        phoneNumber,
        password: hashedPassword,
        email,
        name
      });

      return newUser;
    } catch (error) {
      console.log("userService/create", error);
      throw error;
    }
  };
};
