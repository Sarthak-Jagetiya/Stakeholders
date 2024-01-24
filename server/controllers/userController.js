const { sequelize, User } = require('./../models');
const catchAsync = require('./../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res) => {
  const user = await User.findAll();

  res.status(200).json({
    status: 'success',
    results: user.length,
    data: user,
  });
});

exports.getUser = catchAsync(async (req, res) => {
  const user = await User.findOne({
    where: { id: req.params.id },
  });

  res.status(200).json({
    status: 'success',
    data: user,
  });
});

exports.createUser = catchAsync(async (req, res) => {
  const user = await User.create(req.body);

  res.status(201).json({
    status: 'success',
    data: user,
  });
});

exports.deleteUser = catchAsync(async (req, res) => {
  const user = User.destroy({
    where: { id: req.params.id },
  });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.updateUser = catchAsync(async (req, res) => {
  const doc = await User.update(req.body, {
    where: { id: req.params.id },
  });
  const user = await User.findOne({
    where: { id: req.params.id },
  });
  res.status(200).json({
    status: 'success',
    data: user,
  });
});
