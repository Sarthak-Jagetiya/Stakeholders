const express = require('express');
const logsController = require('../controllers/logsController');

const router = express.Router();
router.route('/').get(logsController.getAllLogs).post(logsController.createLog);

router
  .route('/:id')
  .get(logsController.getLog)
  .delete(logsController.deleteLog)
  .patch(logsController.updateLog);

module.exports = router;
