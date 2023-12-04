const { sequelize, Student } = require('./../models');
const catchAsync = require('./../utils/catchAsync');

exports.getAllStudents = catchAsync(async (req, res) => {
  const student = await Student.findAll({
    order: [['PRN', 'ASC']],
  });
  res.status(200).json({
    status: 'success',
    results: student.length,
    data: student,
  });
});

exports.getStudent = catchAsync(async (req, res) => {
  const student = await Student.findOne({
    where: { PRN: req.params.id },
  });
  res.status(200).json({
    status: 'success',
    data: {
      data: student,
    },
  });
});

exports.getLastStudent = catchAsync(async (req, res) => {
  const latestStudent = await Student.findOne({
    order: [['PRN', 'DESC']],
    attributes: ['PRN'], // Only fetch the PRN field
  });

  let latestPRN = 'BPT2023000';

  if (latestStudent && latestStudent.PRN) {
    // If a record is found, update latestPRN
    latestPRN = latestStudent.PRN;
  }

  res.status(200).json({
    status: 'success',
    data: latestPRN,
  });
});

exports.createStudent = catchAsync(async (req, res) => {
  const student = await Student.create(req.body);
  res.status(201).json({
    status: 'success',
    data: student,
  });
});

exports.deleteStudent = catchAsync(async (req, res) => {
  const student = Student.destroy({
    where: { PRN: req.params.id },
  });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.updateStudent = catchAsync(async (req, res) => {
  const doc = await Student.update(req.body, {
    where: { PRN: req.params.id },
  });
  const student = await Student.findOne({
    where: { PRN: req.params.id },
  });
  res.status(200).json({
    status: 'success',
    data: student,
  });
});
