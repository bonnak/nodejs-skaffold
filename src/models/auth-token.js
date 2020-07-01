const { DataTypes } = require('sequelize');
const { BaseModel } = require('@bonnak/toolset');
const connection = require('../database');

class AuthToken extends BaseModel {
  revoke() {
    return this.update({ revoked: true });
  }
}

AuthToken.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: DataTypes.UUID,
    token: DataTypes.STRING,
    revoked: DataTypes.BOOLEAN,
  },
  {
    sequelize: connection,
  },
);

module.exports = AuthToken;
