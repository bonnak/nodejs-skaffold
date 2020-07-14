const { requireAuth, guardEnum } = require('../middleware/authenticate');
const { AuthToken } = require('../models').models;

module.exports = (router) => {
  router.post(
    '/auth/signout',
    requireAuth(guardEnum.CONSUMER, guardEnum.BACK_OFFICE),
    async (req, res) => {
      req.session = null;

      const authToken = await AuthToken.findOne({
        where: { token: req.jwtToken },
      });

      await authToken.revoke();

      return res.end();
    },
  );
};
