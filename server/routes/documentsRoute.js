const express = require('express');
const documentsController = require('../controllers/documentsController');

const router = express.Router();
router.route('/').get(documentsController.getAllDocuments).post(documentsController.createDocument);

router
  .route('/:id')
  .get(documentsController.getDocument)
  .delete(documentsController.deleteDocument)
  .patch(documentsController.updateDocument);

module.exports = router;
