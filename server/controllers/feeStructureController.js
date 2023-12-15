const { sequelize, FeeStructure } = require('../models');
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

exports.getUniqueFeeCategory = catchAsync(async (req, res) => {
  const uniqueEntries = await FeeStructure.findAll({
    group: ['category'],
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
