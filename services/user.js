const UserModel = require("../models/UserModel");

async function saveUser(userOpt) {
  let user = new UserModel(userOpt);
  user = await user.save()
  return user
}

module.exports = {
  saveUser,
};
