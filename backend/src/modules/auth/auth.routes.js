const express = require('express');
const { body } = require('express-validator');
const auth = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const {
  getProfile,
  requestOtp,
  verifyOtp,
} = require('./auth.controller');

const router = express.Router();

router.post(
  '/request-otp',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required.'),
    body('name').optional().trim().isLength({ min: 2 }).withMessage('Name is too short.'),
  ],
  validate,
  requestOtp
);

router.post(
  '/verify-otp',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required.'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('Enter the 6 digit OTP.'),
  ],
  validate,
  verifyOtp
);

router.get('/me', auth, getProfile);

module.exports = router;
