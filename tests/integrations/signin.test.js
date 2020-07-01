const { expect } = require('chai');
const {
  request, dbMigrate, dbRollback,
} = require('..');
const userFactory = require('../factories/user-factory');

beforeEach(async () => {
  await dbRollback();
  await dbMigrate();
});

describe('Signin', () => {
  it('Should return an access token', async () => {
    await userFactory.create({ username: 'user1', password: 'secret' });

    const { body } = await request.post('/api/auth/login')
      .send({ username: 'user1', password: 'secret' })
      .expect(200);

    expect(body).to.haveOwnProperty('token');
  });
});
