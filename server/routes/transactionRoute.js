const express = require('express');
const transactionController = require('./../controllers/transactionController');

const router = express.Router();
router
  .route('/')
  .get(transactionController.getAllTransaction)
  .post(transactionController.createTransaction);

router
  .route('/:id')
  .get(transactionController.getTransaction)
  .delete(transactionController.deleteTransaction)
  .patch(transactionController.updateTransaction);

module.exports = router;
