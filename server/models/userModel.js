const bcrypt = require('bcryptjs');
const validator = require('validator');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      email: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
        lowercase: true,
        // validate: [validator.isEmail, 'Please provide a valid email'],
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      passwordChangedAt: {
        type: DataTypes.DATE,
      },

      // passwordConfirm: {
      //   type: DataTypes.TEXT,
      //   allowNull: false,
      //   validate: {
      //     isPasswordConfirm: function (el) {
      //       if (el !== this.password) {
      //         throw new Error('Passwords are not the same!');
      //       }
      //     },
      //   },
      // },
    },
    {
      tableName: 'users',
      timestamps: false,
      defaultScope: {
        attributes: {
          exclude: ['password'],
        },
      },
      hooks: {
        beforeCreate: async (user) => {
          user.password = await bcrypt.hash(user.password, 12);
        },
      },
    }
  );

  User.prototype.correctPassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  User.prototype.changedPasswordAfter = async function (JWTTimestamp) {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
      // console.log(changedTimestamp, JWTTimestamp);
      return JWTTimestamp < changedTimestamp;
    }
    // False means NOT changed
    return false;
  };

  return User;
};
