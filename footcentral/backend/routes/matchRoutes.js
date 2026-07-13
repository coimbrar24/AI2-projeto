const router = require('express').Router();
const { getMatches, getResults } = require('../controllers/matchController');

router.get('/', getMatches);
router.get('/results', getResults);

module.exports = router;
