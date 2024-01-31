const express = require('express');
const transactionController = require('./../controllers/transactionController');
const authController = require('./../controllers/authController');

const router = express.Router();
router.route('/sum/:id').get(authController.protect, transactionController.getTransactionSum);

router
  .route('/')
  .get(authController.protect, transactionController.getAllTransaction)
  .post(authController.protect, transactionController.createTransaction);

router
  .route('/:id')
  .get(authController.protect, transactionController.getTransaction)
  .delete(authController.protect, transactionController.deleteTransaction)
  .patch(authController.protect, transactionController.updateTransaction);

module.exports = router;
