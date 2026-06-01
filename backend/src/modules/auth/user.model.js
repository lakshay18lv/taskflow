const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    otpHash: String,
    otpExpiresAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
