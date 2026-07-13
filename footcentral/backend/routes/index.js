const router = require('express').Router();
const authRoutes = require('./authRoutes');
const matchRoutes = require('./matchRoutes');
const teamRoutes = require('./teamRoutes');
const favoriteRoutes = require('./favoriteRoutes');

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'FootCentral API',
  });
});

router.use('/auth', authRoutes);
router.use('/matches', matchRoutes);
router.use('/teams', teamRoutes);
router.use('/favorites', favoriteRoutes);

module.exports = router;
