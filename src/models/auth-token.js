const jwt = require('jsonwebtoken');
const { BaseModel, config } = require('@bonnak/toolset');

module.exports = (sequelize, DataTypes) => {
  class AuthToken extends BaseModel {
    revoke() {
      return this.update({ revoked: true });
    }

    get revoked() {
      return !!this.getDataValue('revoked');
    }

    static async validate(token) {
      const authToken = await AuthToken.findOneOrThrow({
        where: {
          token,
          revoked: false,
        },
      });

      jwt.verify(authToken.token, config.get('auth.jwt.secret'));
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
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
    },
  );

  return AuthToken;
};
