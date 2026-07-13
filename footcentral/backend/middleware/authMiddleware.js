const jwt = require('jsonwebtoken');
const { env } = require('../config/env');
const { User } = require('../models');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Authentication token is required.',
      });
    }

    if (!env.jwt.secret) {
      return res.status(500).json({
        message: 'JWT secret is not configured.',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.jwt.secret);

    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'name', 'email', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      return res.status(401).json({
        message: 'Invalid authentication token.',
      });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired authentication token.',
    });
  }
};

module.exports = {
  authenticate,
};
