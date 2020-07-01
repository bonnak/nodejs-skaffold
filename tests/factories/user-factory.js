const faker = require('faker');
const User = require('../../src/models/user');
const factory = require('.');

const data = (props = {}) => {
  const defaultProps = {
    username: faker.internet.userName(),
    password: 'secret',
    guard: 'Consumer',
  };

  return { ...defaultProps, ...props };
};

module.exports = factory(User, data);
