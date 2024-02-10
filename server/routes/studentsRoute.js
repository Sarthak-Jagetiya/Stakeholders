const express = require('express');
const studentsController = require('./../controllers/studentsController');
const authController = require('./../controllers/authController');

const router = express.Router();
router.route('/lastStudent').post(studentsController.getLastStudent);

router
  .route('/')
  .get(authController.protect, studentsController.getAllStudents)
  .post(authController.protect, studentsController.createStudent);

router
  .route('/:id')
  .get(authController.protect, studentsController.getStudent)
  .patch(authController.protect, studentsController.updateStudent)
  .delete(authController.protect, studentsController.deleteStudent);

module.exports = router;
