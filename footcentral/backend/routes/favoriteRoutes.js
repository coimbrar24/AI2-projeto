const router = require('express').Router();
const favoriteController = require('../controllers/favoriteController');
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate);
router.get('/', favoriteController.index);
router.post('/', favoriteController.store);
router.delete('/:type/:externalId', favoriteController.destroy);

module.exports = router;
