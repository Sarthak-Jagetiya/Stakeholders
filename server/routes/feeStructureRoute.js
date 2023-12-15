const express = require('express');
const feeStructureController = require('../controllers/feeStructureController');

const router = express.Router();
router.route('/unique').get(feeStructureController.getUniqueFeeCategory);
router
  .route('/')
  .get(feeStructureController.getAllFeeStructure)
  .post(feeStructureController.createFeeStructure);

router
  .route('/:id')
  .get(feeStructureController.getFeeStructure)
  .delete(feeStructureController.deleteFeeStructure)
  .patch(feeStructureController.updateFeeStructure);

module.exports = router;
