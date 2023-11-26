const express = require('express');
const documentsController = require('../controllers/documentsController');

const router = express.Router();
router.route('/').get(documentsController.getAllDocuments).post(documentsController.createDocument);

module.exports = router;
