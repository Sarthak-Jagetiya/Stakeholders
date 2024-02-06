const express = require('express');
const resultController = require('../controllers/resultController');
const authController = require('../controllers/authController');

const router = express.Router();
router
  .route('/')
  .get(authController.protect, resultController.getAllResults)
  .post(authController.protect, resultController.createResult);

router
  .route('/:id')
  .get(authController.protect, resultController.getResult)
  .delete(authController.protect, resultController.deleteResult)
  .patch(authController.protect, resultController.updateResult);

module.exports = router;
