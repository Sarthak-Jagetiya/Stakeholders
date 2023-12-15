const express = require('express');
const impDocumentsController = require('../controllers/impDocumentsController');

const router = express.Router();
router
  .route('/')
  .get(impDocumentsController.getAllDocuments)
  .post(impDocumentsController.createDocument);

router
  .route('/:id')
  .get(impDocumentsController.getDocument)
  .delete(impDocumentsController.deleteDocument)
  .patch(impDocumentsController.updateDocument);

module.exports = router;
