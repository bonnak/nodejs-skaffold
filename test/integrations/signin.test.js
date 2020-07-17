require('../setup');

const { expect } = require('chai');
const request = require('supertest');
const app = require('../../src/app');
const userFactory = require('../factories/user-factory');

beforeEach(async () => {
  await global.dbRollback();
  await global.dbMigrate();
});

describe('Signin', () => {
  it('response with an access token when given valid credentials', async () => {
    await userFactory.create({ username: 'user1', password: 'secret' });

    const { body } = await request(app).post('/api/auth/signin')
      .send({ username: 'user1', password: 'secret' })
      .expect(200);

    expect(body).to.haveOwnProperty('token');
  });

  it('fails when a user that does not exist is supplied', async () => {
    await request(app).post('/api/auth/signin')
      .send({
        username: 'not-exist-user',
        password: 'secret',
      })
      .expect(400);
  });

  it('fails when an incorrect password is supplied', async () => {
    await userFactory.create({ username: 'user1', password: 'secret' });

    await request(app).post('/api/auth/signin')
      .send({
        username: 'user1',
        password: 'wrong-password',
      })
      .expect(400);
  });

  it('fails when a user is disabled', async () => {
    await userFactory.create({ username: 'user1', password: 'secret', disabled: true });

    await request.post('/api/auth/signin')
      .send({
        username: 'user1',
        password: 'secret',
      })
      .expect(400);
  });
});
