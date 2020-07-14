const { Sequelize, DataTypes } = require('sequelize');
const { config } = require('@bonnak/toolset');
const UserModel = require('./user');
const AuthTokenModel = require('./auth-token');

const sequelize = new Sequelize(
  config.get('db.database'),
  config.get('db.username'),
  config.get('db.password'),
  {
    dialect: config.get('db.dialect'),
    host: config.get('db.host'),
    port: config.get('db.port'),
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: false,
  },
);

sequelize.authenticate();

const User = UserModel(sequelize, DataTypes);
const AuthToken = AuthTokenModel(sequelize, DataTypes);

User.hasMany(AuthToken, { as: 'tokens' });

module.exports = sequelize;
