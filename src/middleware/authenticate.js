const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { isArray } = require('lodash');
const { config, NotAllowError } = require('@bonnak/toolset');
const { User, AuthToken } = require('../models').models;

const fnUnAuthorizedReqResponse = (res) => res.status(401).json({
  message: 'Unauthorized request',
});

const extractToken = (req) => {
  if (req.headers.authorization) {
    const [tokenType, token] = req.headers.authorization.split(' ');

    if (tokenType.toLowerCase() !== 'bearer') throw new NotAllowError();

    return token;
  }

  if (!req.session.jwt) throw new NotAllowError();

  return req.session.jwt;
};

const requireAuth = (...guard) => async (req, res, next) => {
  try {
    const token = extractToken(req);

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

    if (user === null) throw new NotAllowError();

    const authToken = await AuthToken.findOne({ where: { token } });
    if (authToken.revoked) throw new NotAllowError();

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
