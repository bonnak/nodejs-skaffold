const path = require('path');

module.exports = {
  appUrl: process.env.APP_URL || 'localhost:3000',
  rootPath: path.join(__dirname, '../../'),
  storagePath: path.join(__dirname, '../../static'),
  auth: {
    jwt: {
      secret: process.env.JWT_SECRET,
      salt: process.env.JWT_SALT,
    },
  },
  db: require('./database')[process.env.NODE_ENV || 'development'],
  filesystem: require('./filesystem'),
  transportation: require('./transportation'),
};
