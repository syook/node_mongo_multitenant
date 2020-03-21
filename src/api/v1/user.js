const signUp = async (req, res) => {
  try {
    const userService = req.container.resolve("userService");
    console.log("userService", userService);

    const user = await userService.create(req.body);
    res.status(200).json({ success: true, user });
  } catch (err) {
    console.log("signUp error", err);
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};

const fetchAll = async (req, res) => {
  try {
    const userService = req.container.resolve("userService");
    console.log("userService", userService);
    const users = await userService.fetchAll();
    res.status(200).json({ success: true, users });
  } catch (err) {
    console.log("fetchAll error", err);
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};

module.exports = { signUp, fetchAll };
