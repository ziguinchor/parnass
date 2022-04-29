const config = require("config");
module.exports = () => {
  if (!config.get("jwtPrivateKey")) {
    throw new Error("ERROR : Please define jwtPrivateKey first!");
  }
};
