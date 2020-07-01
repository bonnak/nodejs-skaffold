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
  it('response with an access token when given valid credentials', async () => {
    await userFactory.create({ username: 'user1', password: 'secret' });

    const { body } = await request.post('/api/auth/signin')
      .send({ username: 'user1', password: 'secret' })
      .expect(200);

    expect(body).to.haveOwnProperty('token');
  });
});
