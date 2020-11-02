const express = require('express');
const { getWorld } = require('../controllers/world');

const router = express.Router();

router.route('/').get(getWorld);

module.exports = router;