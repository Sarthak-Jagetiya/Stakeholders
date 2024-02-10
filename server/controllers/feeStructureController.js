const { Op } = require('sequelize');
const { sequelize, Student, FeeStructure } = require('../models');
const catchAsync = require('../utils/catchAsync');

exports.getAllFeeStructure = catchAsync(async (req, res) => {
  const fee = await FeeStructure.findAll();
  res.status(200).json({
    status: 'success',
    results: fee.length,
    data: fee,
  });
});

exports.getFeeStructure = catchAsync(async (req, res) => {
  const fee = await FeeStructure.findOne({
    where: { code: req.params.id },
  });
  res.status(200).json({
    status: 'success',
    data: {
      data: fee,
    },
  });
});

const sumFeeStructure = async (conditions) => {
  const fee = await FeeStructure.findOne({
    attributes: [
      [sequelize.literal('SUM(scholarship)'), 'scholarship'],
      [sequelize.literal('SUM(tuitionfees)'), 'tuitionfees'],
      [sequelize.literal('SUM(eligibilityregistration)'), 'eligibilityregistration'],
      [sequelize.literal('SUM(universityfees)'), 'universityfees'],
      [sequelize.literal('SUM(library)'), 'library'],
      [sequelize.literal('SUM(collegeexam)'), 'collegeexam'],
      [sequelize.literal('SUM(developmentfee)'), 'developmentfee'],
      [sequelize.literal('SUM(other)'), 'other'],
      [sequelize.literal('SUM(cautionmoney)'), 'cautionmoney'],
    ],
    where: conditions,
    // group: ['PRN'],
  });

  return fee;
};

exports.calculateFeesSummary = catchAsync(async (req, res) => {
  const conditions = {};
  if (req.body.admissionyear) conditions.admissionyear = req.body.admissionyear;
  // Fetch all PRNs from Student model
  const students = await Student.findAll({
    attributes: ['PRN', 'feestructure'],
    where: conditions,
  });

  // Extract feestructure codes from each student
  const feestructureCodes = students.map((student) => student.feestructure);
  // console.log(feestructureCodes);

  // Filter FeeStructure based on feestructure codes and academic year
  const feesSummary = await FeeStructure.findAll({
    where: {
      code: {
        [Op.in]: feestructureCodes,
      },
    },
    attributes: [
      // 'code',
      // [(sequelize.fn('SUM', sequelize.col('scholarship')), 'totalScholarship')],
      [sequelize.fn('SUM', sequelize.col('tuitionfees')), 'totalTuitionFees'],
      // [
      //   sequelize.fn('SUM', sequelize.col('eligibilityregistration')),
      //   'totalEligibilityRegistration',
      // ],
      [sequelize.fn('SUM', sequelize.col('universityfees')), 'totalUniversityFees'],
      [sequelize.fn('SUM', sequelize.col('library')), 'totalLibrary'],
      [sequelize.fn('SUM', sequelize.col('collegeexam')), 'totalCollegeExam'],
      [sequelize.fn('SUM', sequelize.col('developmentfee')), 'totalDevelopmentFee'],
      [sequelize.fn('SUM', sequelize.col('other')), 'totalOther'],
      [sequelize.fn('SUM', sequelize.col('cautionmoney')), 'totalCautionMoney'],
    ],
    // group: ['code'],
  });

  res.status(200).json({
    status: 'success',
    data: feesSummary,
  });
});

exports.getFeeStructureSum = catchAsync(async (req, res) => {
  const conditions = {};

  // Add conditions if academicyear, yearname, and PRN are provided in the request body
  if (req.body.academicyear) conditions.academicyear = req.body.academicyear;

  const fee = await sumFeeStructure(conditions);

  res.status(200).json({
    status: 'success',
    data: {
      data: fee,
    },
  });
});

exports.getUniqueFeeCategory = catchAsync(async (req, res) => {
  const uniqueEntries = await FeeStructure.findAll({
    group: ['category'],
    order: [['code', 'ASC']],
  });

  res.status(200).json({
    status: 'success',
    data: {
      data: uniqueEntries,
    },
  });
});

exports.createFeeStructure = catchAsync(async (req, res) => {
  const fee = await FeeStructure.findOne({ where: { code: req.body.code } });
  if (fee) {
    return res.status(500).json({
      status: 'error',
      message: 'Fee Structure with the provided PRN already exists.',
    });
  }
  try {
    const fee = await FeeStructure.create(req.body);
    res.status(201).json({
      status: 'success',
      data: fee,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: 'error',
      message: 'Failed to create the fee structure',
    });
  }
});

exports.deleteFeeStructure = catchAsync(async (req, res) => {
  const fee = FeeStructure.destroy({
    where: { code: req.params.id },
  });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.updateFeeStructure = catchAsync(async (req, res) => {
  const doc = await FeeStructure.update(req.body, {
    where: { code: req.params.id },
  });
  const fee = await FeeStructure.findOne({
    where: { code: req.params.id },
  });
  res.status(200).json({
    status: 'success',
    data: fee,
  });
});
