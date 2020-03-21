const { container } = require("../singleton/awilixContainer");
const mainThreadContainer = container("mainThread");

module.exports = {
  mainThreadContainerScope: () => {
    if (mainThreadContainer) return mainThreadContainer.createScope();
  }
};
