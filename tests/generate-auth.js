const userFactory = require('./factories/user-factory');

module.exports = async (props = {}) => {
  const authUser = await userFactory.create(props);
  const token = await authUser.generateAccessToken();

  return {
    authUser,
    token,
    authorization: `Bearer ${token}`,
  };
};
