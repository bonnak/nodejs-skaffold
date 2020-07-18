const { expect } = require('chai');
const request = require('supertest');
const app = require('../../src/app');
const { AuthToken } = require('../../src/models').models;

beforeEach(async () => {
  await global.dbRollback();
  await global.dbMigrate();
});

describe('Signout', () => {
  it('Should return an access token', async () => {
    await request(app).post('/api/auth/signout')
      .set('Authorization', global.authorization())
      .expect(200);

    const authToken = await AuthToken.findOne();
    expect(authToken.revoked).to.be.true;
  });
});
