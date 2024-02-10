const express = require('express');
const feeStructureController = require('../controllers/feeStructureController');
const authController = require('./../controllers/authController');

const router = express.Router();
router.route('/unique').get(feeStructureController.getUniqueFeeCategory);
router.route('/sum').post(authController.protect, feeStructureController.getFeeStructureSum);
router.route('/summary').post(authController.protect, feeStructureController.calculateFeesSummary);

router
  .route('/')
  .get(authController.protect, feeStructureController.getAllFeeStructure)
  .post(authController.protect, feeStructureController.createFeeStructure);

router
  .route('/:id')
  .get(authController.protect, feeStructureController.getFeeStructure)
  .delete(authController.protect, feeStructureController.deleteFeeStructure)
  .patch(authController.protect, feeStructureController.updateFeeStructure);

module.exports = router;
