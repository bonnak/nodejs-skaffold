const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { isArray } = require('lodash');
const { config } = require('@bonnak/toolset');
const User = require('../models/user');

const fnUnAuthorizedReqResponse = (res) => res.status(401).json({
  message: 'Unauthorized request',
});

const requireAuth = (...guard) => async (req, res, next) => {
  try {
    const [tokenType, token] = req.headers.authorization.split(' ');

    if (tokenType.toLowerCase() !== 'bearer') return fnUnAuthorizedReqResponse(res);

    const decodedToken = jwt.verify(token, config.get('auth.jwt.secret'));
    const user = await User.findOne({
      where: {
        id: decodedToken.userId,
        disabled: false,
        guard: {
          [Op.in]: isArray(guard) ? guard : [guard],
        },
      },
    });

    if (user === null) return fnUnAuthorizedReqResponse(res);

    req.user = user;
    req.authToken = token;
    next();
  } catch (err) {
    fnUnAuthorizedReqResponse(res);
  }
};

const guardEnum = { CONSUMER: 'Consumer', BACK_OFFICE: 'Back office' };

exports.guardEnum = guardEnum;
exports.requireAuth = requireAuth;
exports.authenticated = requireAuth(guardEnum.CONSUMER);
exports.authBackOffice = requireAuth(guardEnum.BACK_OFFICE);
