/* eslint-disable no-console */

const path = require('path');
const { exec } = require('child_process');
const { config } = require('@bonnak/toolset');

const enArr = [
  path.join(__dirname, '../node_modules/.bin/cross-env'),
  `DB_CONNECTION=${config.get('db.dialect')}`,
  `DB_HOST=${config.get('db.host')}`,
  `DB_PORT=${config.get('db.port')}`,
  `DB_NAME=${config.get('db.database')}`,
  `DB_USER=${config.get('db.username')}`,
  `DB_PASSWORD=${config.get('db.password')}`,
];

const dbMigrate = () => new Promise((resolve, reject) => {
  exec(
    [...enArr, 'npx sequelize-cli', 'db:migrate'].join(' '),
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

const dbRollback = () => new Promise((resolve, reject) => {
  exec(
    [...enArr, 'npx sequelize-cli', 'db:migrate:undo:all'].join(' '),
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

module.exports = { dbMigrate, dbRollback };
