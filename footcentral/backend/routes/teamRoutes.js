const router = require('express').Router();
const { search, show } = require('../controllers/teamController');

router.get('/search', search);
router.get('/:id', show);

module.exports = router;
