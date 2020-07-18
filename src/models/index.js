const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const { config } = require('@bonnak/toolset');

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

fs
  .readdirSync(__dirname)
  .filter((file) => file !== path.basename(__filename) && file.slice(-3) === '.js')
  .forEach((file) => {
    // eslint-disable-next-line import/no-dynamic-require
    const model = require(path.join(__dirname, file));
    model(sequelize, DataTypes);
  });

Object.keys(sequelize.models).forEach((modelName) => {
  if (sequelize.models[modelName].associate) {
    sequelize.models[modelName].associate(sequelize.models);
  }
});

module.exports = sequelize;
