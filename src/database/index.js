const Sequelize = require('sequelize');
const { config } = require('@bonnak/toolset');

const connection = new Sequelize(
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

connection.authenticate();

module.exports = connection;
