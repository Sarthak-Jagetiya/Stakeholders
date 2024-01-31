const express = require('express');
const employeeController = require('../controllers/employeeController');
const authController = require('./../controllers/authController');

const router = express.Router();
router
  .route('/')
  .get(authController.protect, employeeController.getAllEmployee)
  .post(authController.protect, employeeController.createEmployee);

router
  .route('/:id')
  .get(authController.protect, employeeController.getEmployee)
  .delete(authController.protect, employeeController.deleteEmployee)
  .patch(authController.protect, employeeController.updateEmployee);

module.exports = router;
