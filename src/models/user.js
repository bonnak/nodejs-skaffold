const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { config, BaseModel } = require('@bonnak/toolset');
const connection = require('../database');
const AuthToken = require('./auth-token');

class User extends BaseModel {
  static async register({ username, password }) {
    const user = await this.create({
      username,
      password,
    });

    return user;
  }

  validatePassword(password) {
    return bcrypt.compare(password, this.password);
  }

  async generateAccessToken() {
    const token = jwt.sign(
      { userId: this.id },
      config.get('auth.jwt.secret'),
      { expiresIn: '365d' },
    );

    await AuthToken.create({
      userId: this.id,
      token,
      revoked: false,
    });

    return token;
  }

  static async attemptToAuthenticate({ username, password }) {
    const user = await User.findOne({
      where: {
        username,
        disabled: false,
      },
    });

    if (user === null) {
      throw new Error('Invalid credentials');
    }

    const attemptPassed = await user.validatePassword(password);

    if (!attemptPassed) {
      throw new Error('Invalid credentials');
    }

    return user;
  }

  toJSON() {
    const data = { ...this.get() };

    delete data.password;

    return data;
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    username: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      set(password) {
        this.setDataValue(
          'password',
          bcrypt.hashSync(password, parseInt(config.get('auth.jwt.salt'))),
        );
      },
    },
    disabled: DataTypes.BOOLEAN,
    guard: DataTypes.ENUM('Back office', 'Consumer'),
  },
  {
    sequelize: connection,
    paranoid: true,
  },
);

module.exports = User;
