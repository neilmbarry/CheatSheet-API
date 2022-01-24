const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
});

const User = mongoose.model('user', userSchema);

module.exports = User;
