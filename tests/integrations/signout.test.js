const { expect } = require('chai');
const {
  request, dbMigrate, dbRollback, generateAuth,
} = require('..');
const AuthToken = require('../../src/models/auth-token');

beforeEach(async () => {
  await dbRollback();
  await dbMigrate();
});

describe('Signout', () => {
  it('Should return an access token', async () => {
    const { token, authUser } = await generateAuth();

    await request.post('/api/auth/signout')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const count = await AuthToken.count({ where: { token, revoked: true, userId: authUser.id } });
    expect(count).to.equal(1);
  });
});
