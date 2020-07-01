const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { config, BaseModel } = require('@bonnak/toolset');
const connection = require('../database');

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
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    username: Sequelize.STRING,
    password: {
      type: Sequelize.STRING,
      set(password) {
        this.setDataValue(
          'password',
          bcrypt.hashSync(password, parseInt(config.get('auth.jwt.salt'))),
        );
      },
    },
    disabled: Sequelize.BOOLEAN,
  },
  {
    sequelize: connection,
    paranoid: true,
  },
);

module.exports = User;
