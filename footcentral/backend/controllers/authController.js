const authService = require('../services/authService');

const register = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);

    return res.status(201).json({
      message: 'User registered successfully.',
      user,
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const authData = await authService.loginUser(req.body);

    return res.status(200).json({
      message: 'Login successful.',
      ...authData,
    });
  } catch (error) {
    return next(error);
  }
};

const getMe = async (req, res) => {
  return res.status(200).json({
    user: req.user,
  });
};

module.exports = {
  register,
  login,
  getMe,
};
