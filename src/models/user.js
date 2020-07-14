const _ = require('lodash');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { config, BaseModel, ModelNotFoundError } = require('@bonnak/toolset');

module.exports = (sequelize, DataTypes) => {
  class User extends BaseModel {
    static async register({ phoneNumber, password }) {
      const user = await this.create({
        phoneNumber,
        username: phoneNumber,
        password,
        confirmed: false,
        confirmCode: this.generateConfirmCode(),
        guard: 'Consumer',
      });

      return user;
    }

    validatePassword(password) {
      return bcrypt.compare(password, this.password());
    }

    async generateAccessToken() {
      const accessToken = jwt.sign(
        { userId: this.id },
        config.get('auth.jwt.secret'),
        { expiresIn: '365d' },
      );

      await sequelize.models.AuthToken.create({ token: accessToken, userId: this.id });

      return accessToken;
    }

    static async attemptToAuthenticate({
      phoneNumber, username, password, guard,
    }) {
      const user = await User.findOne({
        where: {
          username: phoneNumber || username,
          confirmed: true,
          disabled: false,
          guard,
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

    static generateConfirmCode() {
      const min = 10000;
      const max = 100000;

      return min + Math.floor((max - min) * Math.random());
    }

    static async confirmRegistration({ phoneNumber, confirmCode }) {
      const user = await User.findOne({ where: { phoneNumber, confirmCode } });

      if (user === null) {
        throw new ModelNotFoundError('Invalid confirmed code');
      }

      return user.update({ confirmed: true, confirmCode: null });
    }

    get isBackOffice() {
      return this.getDataValue('guard') === 'Back office';
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      username: {
        unique: true,
        allowNull: false,
        type: DataTypes.STRING,
      },
      phoneNumber: DataTypes.STRING,
      password: {
        type: DataTypes.STRING,
        set(password) {
          this.setDataValue(
            'password',
            bcrypt.hashSync(password, parseInt(process.env.JWT_SALT_ROUND)),
          );
        },
        get() {
          return () => this.getDataValue('password');
        },
      },
      firstName: {
        type: DataTypes.STRING,
      },
      lastName: {
        type: DataTypes.STRING,
      },
      fullName: {
        type: DataTypes.VIRTUAL(DataTypes.STRING, ['firstName', 'lastName']),
        set(value) {
          const names = value.split(' ');
          this.setDataValue(
            'firstName',
            _.capitalize(names.slice(0, 1).join(' ')),
          );
          this.setDataValue('lastName', _.capitalize(names.slice(1).join(' ')));
        },
        get() {
          const firstName = this.getDataValue('firstName') || '';
          const lastName = this.getDataValue('lastName') || '';
          const fullName = `${firstName} ${lastName}`.trim() || null;

          return fullName;
        },
      },
      confirmed: {
        defaultValue: false,
        type: DataTypes.BOOLEAN,
      },
      confirmCode: {
        type: DataTypes.STRING,
      },
      disabled: {
        defaultValue: false,
        type: DataTypes.BOOLEAN,
      },
      photo: DataTypes.STRING,
      guard: DataTypes.ENUM('Back office', 'Consumer'),
      isRoot: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      paranoid: true,
    },
  );

  return User;
};
