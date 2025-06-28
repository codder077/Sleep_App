const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { displayName, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'Registration failed',
      errors: [{
        field: 'email',
        message: 'An account with this email address already exists. Please use a different email or try logging in.',
        code: 'EMAIL_EXISTS'
      }]
    });
  }

  try {
    // Create user
    const user = await User.create({
      displayName,
      email,
      password
    });

    // Generate token
    const token = user.generateAuthToken();

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to Sleep Assessment.',
      data: {
        user: user.getProfile(),
        token,
        expiresIn: process.env.JWT_EXPIRE
      }
    });
  } catch (error) {
    // Handle specific Mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.keys(error.errors).map(field => ({
        field: field,
        message: error.errors[field].message,
        code: 'VALIDATION_ERROR'
      }));

      return res.status(400).json({
        success: false,
        message: 'Registration failed due to validation errors',
        errors: validationErrors
      });
    }

    // Handle duplicate key errors (email)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Registration failed',
        errors: [{
          field: 'email',
          message: 'This email address is already registered. Please use a different email or try logging in.',
          code: 'EMAIL_EXISTS'
        }]
      });
    }

    // Re-throw other errors
    throw error;
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findByEmail(email).select('+password');
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Login failed',
      errors: [{
        field: 'email',
        message: 'No account found with this email address. Please check your email or register a new account.',
        code: 'USER_NOT_FOUND'
      }]
    });
  }

  // Check if user is active
  if (!user.isActive) {
    return res.status(401).json({
      success: false,
      message: 'Login failed',
      errors: [{
        field: 'account',
        message: 'Your account has been deactivated. Please contact support for assistance.',
        code: 'ACCOUNT_DEACTIVATED'
      }]
    });
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Login failed',
      errors: [{
        field: 'password',
        message: 'Incorrect password. Please check your password and try again.',
        code: 'INVALID_PASSWORD'
      }]
    });
  }

  // Generate token
  const token = user.generateAuthToken();

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  res.json({
    success: true,
    message: 'Login successful! Welcome back.',
    data: {
      user: user.getProfile(),
      token,
      expiresIn: process.env.JWT_EXPIRE
    }
  });
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user.getProfile()
    }
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const {
    displayName,
    phoneCode,
    phoneNumber,
    photoURL,
    city,
    state,
    country
  } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (displayName) user.displayName = displayName;
    if (phoneCode) user.phoneCode = phoneCode;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (photoURL) user.photoURL = photoURL;
    if (city) user.city = city;
    if (state) user.state = state;
    if (country) user.country = country;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      data: {
        user: user.getProfile()
      }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationErrors = Object.keys(error.errors).map(field => ({
        field: field,
        message: error.errors[field].message,
        code: 'VALIDATION_ERROR'
      }));

      return res.status(400).json({
        success: false,
        message: 'Profile update failed due to validation errors',
        errors: validationErrors
      });
    }

    throw error;
  }
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  // Check current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: 'Password change failed',
      errors: [{
        field: 'currentPassword',
        message: 'Current password is incorrect. Please enter your current password correctly.',
        code: 'INVALID_CURRENT_PASSWORD'
      }]
    });
  }

  // Check if new password is same as current
  const isNewPasswordSame = await user.comparePassword(newPassword);
  if (isNewPasswordSame) {
    return res.status(400).json({
      success: false,
      message: 'Password change failed',
      errors: [{
        field: 'newPassword',
        message: 'New password must be different from your current password.',
        code: 'SAME_PASSWORD'
      }]
    });
  }

  try {
    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully! Please log in again with your new password.'
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationErrors = Object.keys(error.errors).map(field => ({
        field: field,
        message: error.errors[field].message,
        code: 'VALIDATION_ERROR'
      }));

      return res.status(400).json({
        success: false,
        message: 'Password change failed due to validation errors',
        errors: validationErrors
      });
    }

    throw error;
  }
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  // In a stateless JWT setup, logout is handled client-side
  // But we can track logout events if needed
  res.json({
    success: true,
    message: 'Logged out successfully!'
  });
});

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Private
const refreshToken = asyncHandler(async (req, res) => {
  const token = req.user.generateAuthToken();

  res.json({
    success: true,
    message: 'Token refreshed successfully',
    data: {
      token,
      expiresIn: process.env.JWT_EXPIRE
    }
  });
});

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  logout,
  refreshToken
}; 