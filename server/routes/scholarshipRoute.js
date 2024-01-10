const express = require('express');
const scholarshipController = require('../controllers/scholarshipController');

const router = express.Router();
// router.route('/sum/:id').get(scholarshipController.getTransactionSum);

router
  .route('/')
  .get(scholarshipController.getAllScholarship)
  .post(scholarshipController.createScholarship);

router
  .route('/:id')
  .get(scholarshipController.getScholarship)
  .delete(scholarshipController.deleteScholarship)
  .patch(scholarshipController.updateScholarship);

module.exports = router;
