const { sequelize, Logs, User } = require('../models');
const catchAsync = require('../utils/catchAsync');

exports.getAllLogs = catchAsync(async (req, res) => {
  const log = await Logs.findAll();
  res.status(200).json({
    status: 'success',
    results: log.length,
    data: log,
  });
});

exports.getLog = catchAsync(async (req, res) => {
  const log = await Logs.findOne({
    where: { logID: req.params.id },
  });
  res.status(200).json({
    status: 'success',
    data: {
      data: log,
    },
  });
});

exports.createLog = catchAsync(async (req, res) => {
  const user = await User.findOne({ where: { id: req.body.userID } });
  if (!user) {
    return res.status(399).json({
      status: 'error',
      message: 'User with the provided ID does not exist.',
    });
  }
  const log = await Logs.create(req.body);
  res.status(201).json({
    status: 'success',
    data: log,
  });
});

exports.deleteLog = catchAsync(async (req, res) => {
  const log = Logs.destroy({
    where: { logID: req.params.id },
  });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.updateLog = catchAsync(async (req, res) => {
  const log = await Logs.update(req.body, {
    where: { LogID: req.params.id },
  });
  const l = await Logs.findOne({
    where: { LogID: req.params.id },
  });
  res.status(200).json({
    status: 'success',
    data: l,
  });
});
