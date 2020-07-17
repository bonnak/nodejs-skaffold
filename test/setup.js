/* eslint-disable no-console */

const path = require('path');
const { exec } = require('child_process');
const jwt = require('jsonwebtoken');
const { v4 } = require('uuid');
const { config } = require('@bonnak/toolset');

config.load(require('../src/config'));

global.authorization = () => {
  const payload = {
    id: v4(),
  };

  const token = jwt.sign(payload, config.get('auth.jwt.secret'));

  return `Bearer ${token}`;
};

global.authCookie = () => {
  const payload = {
    id: v4(),
  };

  const token = jwt.sign(payload, config.get('auth.jwt.secret'));

  const session = { jwt: token };

  const sessionJSON = JSON.stringify(session);

  const base64 = Buffer.from(sessionJSON).toString('base64');

  return [`express:sess=${base64}`];
};

global.dbMigrate = () => new Promise((resolve, reject) => {
  exec(
    [
      path.join(__dirname, '../node_modules/.bin/cross-env'),
      `DB_CONNECTION=${config.get('db.dialect')}`,
      `DB_HOST=${config.get('db.host')}`,
      `DB_PORT=${config.get('db.port')}`,
      `DB_NAME=${config.get('db.database')}`,
      `DB_USER=${config.get('db.username')}`,
      `DB_PASSWORD=${config.get('db.password')}`,
      'npx sequelize-cli', 'db:migrate',
    ].join(' '),
    (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        return reject(err);
      }

      if (stderr) {
        console.error(stderr);
        return reject(stderr);
      }

      resolve(stdout);
    },
  );
});

global.dbRollback = () => new Promise((resolve, reject) => {
  exec(
    [
      path.join(__dirname, '../node_modules/.bin/cross-env'),
      `DB_CONNECTION=${config.get('db.dialect')}`,
      `DB_HOST=${config.get('db.host')}`,
      `DB_PORT=${config.get('db.port')}`,
      `DB_NAME=${config.get('db.database')}`,
      `DB_USER=${config.get('db.username')}`,
      `DB_PASSWORD=${config.get('db.password')}`,
      'npx sequelize-cli', 'db:migrate:undo:all',
    ].join(' '),
    (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        return reject(err);
      }

      if (stderr) {
        console.error(stderr);
        return reject(stderr);
      }

      resolve(stdout);
    },
  );
});
