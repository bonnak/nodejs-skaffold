const faker = require('faker');
const User = require('../../src/models/user');
const factory = require('.');

const data = (props = {}) => {
  const username = faker.internet.userName();

  const defaultProps = {
    username,
    password: 'secret',
  };

  return { ...defaultProps, ...props };
};

module.exports = factory(User, data);
