const express = require('express');
const employeeController = require('../controllers/employeeController');

const router = express.Router();
router.route('/').get(employeeController.getAllEmployee).post(employeeController.createEmployee);

router
  .route('/:id')
  .get(employeeController.getEmployee)
  .delete(employeeController.deleteEmployee)
  .patch(employeeController.updateEmployee);

module.exports = router;
