const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'A user must have a name.'],
  },
  email: {
    type: String,
    trim: true,
    required: [true, 'A user must have an email address.'],
    lowercase: true,
    unique: [true, 'This email address is already in use.'],
    validate: [validator.isEmail, 'Please provide a valid email.'],
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
    required: [true, 'A user must have a role.'],
  },
  password: {
    type: String,
    required: [true, 'A user must have a password.'],
    minlength: [8, 'A user password must be at least 8 characters long.'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password.'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
  faves: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Faves',
    },
  ],
  submissions: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Cocktail',
    },
  ],
  reviews: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Reviews',
    },
  ],
  // inventory: [String],
  // reviews: [String],
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now();
  next();
});

userSchema.methods.isCorrectPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 600000;
  return resetToken;
};

userSchema.methods.tokenExpired = function () {
  if (!this.passwordResetExpires) return;
  return this.passwordResetExpires.getTime() < Date.now();
};

const User = mongoose.model('User', userSchema);

module.exports = User;
