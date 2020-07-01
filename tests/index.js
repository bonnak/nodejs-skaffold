require('dotenv').config();

const rewire = require('rewire');
const { config } = require('@bonnak/toolset');

config.load(require('../src/config'));

const app = rewire('../src/app');
const request = require('./request');
const { dbMigrate, dbRollback } = require('./runDbMigration');
const generateAuth = require('./generate-auth');

module.exports = {
  app,
  request: request(app),
  dbMigrate,
  dbRollback,
  generateAuth,
};
