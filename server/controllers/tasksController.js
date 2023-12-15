const { sequelize, Task, Employee } = require('../models');
const catchAsync = require('../utils/catchAsync');

exports.getAllTask = catchAsync(async (req, res) => {
  const task = await Task.findAll();
  res.status(200).json({
    status: 'success',
    results: task.length,
    data: task,
  });
});

exports.getTask = catchAsync(async (req, res) => {
  const task = await Task.findOne({
    where: { tid: req.params.id },
  });

  res.status(200).json({
    status: 'success',
    data: {
      data: task,
    },
  });
});

exports.createTask = catchAsync(async (req, res) => {
  const employee = await Employee.findOne({ where: { eid: req.body.eid } });
  if (!employee) {
    return res.status(399).json({
      status: 'error',
      message: 'Employee with the provided eid does not exist.',
    });
  }

  const task = await Task.create(req.body);
  res.status(201).json({
    status: 'success',
    data: task,
  });
});

exports.deleteTask = catchAsync(async (req, res) => {
  const task = Task.destroy({
    where: { tid: req.params.id },
  });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.updateTask = catchAsync(async (req, res) => {
  const employee = await Employee.findOne({ where: { eid: req.body.eid } });
  if (!employee) {
    return res.status(399).json({
      status: 'error',
      message: 'Employee with the provided eid does not exist.',
    });
  }
  const doc = await Task.update(req.body, {
    where: { tid: req.params.id },
  });
  const task = await Task.findOne({
    where: { tid: req.params.id },
  });
  res.status(200).json({
    status: 'success',
    data: task,
  });
});
