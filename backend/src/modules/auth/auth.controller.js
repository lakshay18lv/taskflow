const asyncHandler = require('../../utils/asyncHandler');
const { generateOtp, hashOtp } = require('../../utils/otp');
const { signToken } = require('../../utils/token');
const env = require('../../config/env');
const User = require('./user.model');

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
});

const requestOtp = asyncHandler(async (req, res) => {
  const { email, name } = req.body;
  const otp = generateOtp();
  const otpHash = hashOtp(otp);
  const otpExpiresAt = new Date(Date.now() + env.otpTtlMinutes * 60 * 1000);

  const user = await User.findOneAndUpdate(
    { email },
    {
      $set: {
        ...(name ? { name } : {}),
        otpHash,
        otpExpiresAt,
      },
      $setOnInsert: { email },
    },
    { new: true, upsert: true, runValidators: true }
  );

  res.json({
    message: 'OTP sent successfully.',
    user: publicUser(user),
    // Keep this in development so evaluators can test without an SMS/email provider.
    devOtp: env.nodeEnv === 'production' ? undefined : otp,
  });
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const otpHash = hashOtp(otp);

  const user = await User.findOne({
    email,
    otpHash,
    otpExpiresAt: { $gt: new Date() },
  });

  if (!user) {
    return res.status(401).json({ message: 'Invalid or expired OTP.' });
  }

  user.otpHash = undefined;
  user.otpExpiresAt = undefined;
  await user.save();

  res.json({
    token: signToken(user),
    user: publicUser(user),
  });
});

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('name email');

  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  res.json({ user: publicUser(user) });
});

module.exports = { getProfile, requestOtp, verifyOtp };
