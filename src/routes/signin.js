const { body } = require('express-validator');
const { validateRequest } = require('@bonnak/toolset');
const { User } = require('../models').models;

module.exports = (router) => {
  router.post(
    '/auth/signin',
    validateRequest([
      body('username').notEmpty().withMessage('Required'),
      body('password').notEmpty().withMessage('Required'),
    ]),
    async (req, res) => {
      const { username, password } = req.body;

      const user = await User.attemptToAuthenticate({ username, password });
      const token = await user.generateAccessToken();

      req.session = { jwt: token };

      return res.json({ token });
    },
  );
};
