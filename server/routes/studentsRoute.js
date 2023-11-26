const express = require('express');
const studentsController = require('./../controllers/studentsController');

const router = express.Router();
router.route('/').get(studentsController.getAllStudents).post(studentsController.createStudent);

router
  .route('/:id')
  .get(studentsController.getStudent)
  .patch(studentsController.updateStudent)
  .delete(studentsController.deleteStudent);

module.exports = router;
