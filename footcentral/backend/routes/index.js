const router = require('express').Router();
const authRoutes = require('./authRoutes');

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'FootCentral API',
  });
});

router.use('/auth', authRoutes);

module.exports = router;
