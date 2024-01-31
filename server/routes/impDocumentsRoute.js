const express = require('express');
const impDocumentsController = require('../controllers/impDocumentsController');
const authController = require('./../controllers/authController');

const router = express.Router();
router
  .route('/')
  .get(authController.protect, impDocumentsController.getAllDocuments)
  .post(authController.protect, impDocumentsController.createDocument);

router
  .route('/:id')
  .get(authController.protect, impDocumentsController.getDocument)
  .delete(authController.protect, impDocumentsController.deleteDocument)
  .patch(authController.protect, impDocumentsController.updateDocument);

module.exports = router;
