const { sequelize, Scholarship, Transaction, Student } = require('../models');
const catchAsync = require('../utils/catchAsync');

exports.getAllScholarship = catchAsync(async (req, res) => {
  const scholarship = await Scholarship.findAll();
  res.status(200).json({
    status: 'success',
    results: scholarship.length,
    data: scholarship,
  });
});

exports.getScholarship = catchAsync(async (req, res) => {
  const scholarship = await Scholarship.findOne({ where: { id: req.params.id } });
  res.status(200).json({
    status: 'success',
    results: scholarship.length,
    data: {
      data: scholarship,
    },
  });
});

// exports.getTransactionSum = catchAsync(async (req, res) => {
//   const PRN = req.params.id;

//   const transaction = await Transaction.findOne({
//     attributes: [
//       'PRN',
//       [sequelize.literal('SUM(scholarship)'), 'scholarship'],
//       [sequelize.literal('SUM(tuitionfees)'), 'tuitionfees'],
//       [sequelize.literal('SUM(eligibilityregistration)'), 'eligibilityregistration'],
//       [sequelize.literal('SUM(universityfees)'), 'universityfees'],
//       [sequelize.literal('SUM(library)'), 'library'],
//       [sequelize.literal('SUM(collegeexam)'), 'collegeexam'],
//       [sequelize.literal('SUM(other)'), 'other'],
//       [sequelize.literal('SUM(cautionmoney)'), 'cautionmoney'],
//       'signature',
//       'academicyear',
//       'yearname',
//       'remark',
//       'date',
//       'paymenttype',
//       'utr',
//     ],
//     where: { PRN: PRN },
//     group: ['PRN'],
//   });

//   res.status(200).json({
//     status: 'success',
//     data: {
//       data: transaction,
//     },
//   });
// });

exports.createScholarship = catchAsync(async (req, res) => {
  const student = await Student.findOne({ where: { PRN: req.body.PRN } });
  if (!student) {
    return res.status(399).json({
      status: 'error',
      message: 'Student with the provided PRN does not exist.',
    });
  }

  if (req.body.transactionID) {
    const transaction = await Transaction.findOne({ where: { id: req.body.transactionID } });
    if (!transaction) {
      return res.status(400).json({
        status: 'error',
        message: 'Transaction with the provided ID does not exist.',
      });
    }
  }

  const scholarship = await Scholarship.create(req.body);
  res.status(201).json({
    status: 'success',
    data: scholarship,
  });
});

exports.deleteScholarship = catchAsync(async (req, res) => {
  const scholarship = Scholarship.destroy({
    where: { id: req.params.id },
  });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.updateScholarship = catchAsync(async (req, res) => {
  const doc = await Scholarship.update(req.body, {
    where: { id: req.params.id },
  });
  const scholarship = await Scholarship.findOne({
    where: { id: req.params.id },
  });
  res.status(200).json({
    status: 'success',
    data: scholarship,
  });
});
