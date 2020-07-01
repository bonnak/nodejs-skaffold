const { body } = require('express-validator');
const { validateRequest } = require('@bonnak/toolset');
const User = require('../models/user');

module.exports = (router) => {
  router.post(
    '/auth/signin',
    validateRequest([
      body('username').notEmpty().withMessage('Required'),
      body('password').notEmpty().withMessage('Required'),
    ]),
    async (req, res) => {
      const { username, password } = req.body;

      try {
        const user = await User.attemptToAuthenticate({ username, password });
        const token = await user.generateAccessToken();

        req.session = { jwt: token };

        return res.json({ token });
      } catch (err) {
        return res.status(401).json({ message: err.message });
      }
    },
  );
};
