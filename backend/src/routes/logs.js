const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const { listLogs } = require('../controllers/logController');

router.use(authMiddleware);
router.get('/', listLogs);

module.exports = router;
