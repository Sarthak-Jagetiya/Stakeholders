const express = require('express');
const scholarshipController = require('../controllers/scholarshipController');
const authController = require('./../controllers/authController');

const router = express.Router();
// router.route('/sum/:id').get(scholarshipController.getTransactionSum);

router
  .route('/')
  .get(authController.protect, scholarshipController.getAllScholarship)
  .post(authController.protect, scholarshipController.createScholarship);

router
  .route('/:id')
  .get(authController.protect, scholarshipController.getScholarship)
  .delete(authController.protect, scholarshipController.deleteScholarship)
  .patch(authController.protect, scholarshipController.updateScholarship);

module.exports = router;
