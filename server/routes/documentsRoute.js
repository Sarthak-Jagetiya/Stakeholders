const express = require('express');
const documentsController = require('../controllers/documentsController');
const authController = require('../controllers/authController');

const router = express.Router();
router
  .route('/')
  .get(authController.protect, documentsController.getAllDocuments)
  .post(authController.protect, documentsController.createDocument);

router
  .route('/:id')
  .get(authController.protect, documentsController.getDocument)
  .delete(authController.protect, documentsController.deleteDocument)
  .patch(authController.protect, documentsController.updateDocument);

module.exports = router;
