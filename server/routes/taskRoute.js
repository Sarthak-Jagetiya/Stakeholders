const express = require('express');
const taskController = require('../controllers/tasksController');
const authController = require('./../controllers/authController');

const router = express.Router();
router
  .route('/')
  .get(authController.protect, taskController.getAllTask)
  .post(authController.protect, taskController.createTask);

router
  .route('/:id')
  .get(authController.protect, taskController.getTask)
  .delete(authController.protect, taskController.deleteTask)
  .patch(authController.protect, taskController.updateTask);

module.exports = router;
