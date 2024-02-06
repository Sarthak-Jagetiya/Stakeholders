const { sequelize, Transaction, Student } = require('./../models');
const catchAsync = require('./../utils/catchAsync');

exports.getAllTransaction = catchAsync(async (req, res) => {
  const transaction = await Transaction.findAll();
  res.status(200).json({
    status: 'success',
    results: transaction.length,
    data: transaction,
  });
});

exports.getTransaction = catchAsync(async (req, res) => {
  const transaction = await Transaction.findOne({ where: { id: req.params.id } });
  res.status(200).json({
    status: 'success',
    results: transaction.length,
    data: {
      data: transaction,
    },
  });
});

exports.getTransactionSum = catchAsync(async (req, res) => {
  const PRN = req.params.id;

  const transaction = await Transaction.findOne({
    attributes: [
      'PRN',
      [sequelize.literal('SUM(scholarship)'), 'scholarship'],
      [sequelize.literal('SUM(tuitionfees)'), 'tuitionfees'],
      [sequelize.literal('SUM(eligibilityregistration)'), 'eligibilityregistration'],
      [sequelize.literal('SUM(universityfees)'), 'universityfees'],
      [sequelize.literal('SUM(library)'), 'library'],
      [sequelize.literal('SUM(collegeexam)'), 'collegeexam'],
      [sequelize.literal('SUM(developmentfee)'), 'developmentfee'],
      [sequelize.literal('SUM(other)'), 'other'],
      [sequelize.literal('SUM(cautionmoney)'), 'cautionmoney'],
      'signature',
      'academicyear',
      'yearname',
      'remark',
      'date',
      'paymenttype',
      'utr',
    ],
    where: { PRN: PRN },
    group: ['PRN'],
  });

  res.status(200).json({
    status: 'success',
    data: {
      data: transaction,
    },
  });
});

exports.createTransaction = catchAsync(async (req, res) => {
  const student = await Student.findOne({ where: { PRN: req.body.PRN } });
  if (!student) {
    return res.status(400).json({
      status: 'error',
      message: 'Student with the provided PRN does not exist.',
    });
  }

  const transaction = await Transaction.create(req.body);
  res.status(201).json({
    status: 'success',
    data: transaction,
  });
});

exports.deleteTransaction = catchAsync(async (req, res) => {
  const transaction = Transaction.destroy({
    where: { id: req.params.id },
  });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.updateTransaction = catchAsync(async (req, res) => {
  const doc = await Transaction.update(req.body, {
    where: { id: req.params.id },
  });
  const transaction = await Transaction.findOne({
    where: { id: req.params.id },
  });
  res.status(200).json({
    status: 'success',
    data: transaction,
  });
});
