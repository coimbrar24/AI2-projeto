const { env } = require('../config/env');

const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    message: error.message || 'Internal server error.',
    ...(env.nodeEnv === 'development' && { stack: error.stack }),
  });
};

module.exports = {
  errorHandler,
};
