const { sequelize, Employee } = require('./../models');
const catchAsync = require('./../utils/catchAsync');

exports.getAllEmployee = catchAsync(async (req, res) => {
  const employee = await Employee.findAll({
    order: [['eid', 'ASC']],
  });
  res.status(200).json({
    status: 'success',
    results: employee.length,
    data: employee,
  });
});

exports.getEmployee = catchAsync(async (req, res) => {
  const employee = await Employee.findOne({
    where: { eid: req.params.id },
  });
  res.status(200).json({
    status: 'success',
    data: {
      data: employee,
    },
  });
});

exports.createEmployee = catchAsync(async (req, res) => {
  const employee = await Employee.create(req.body);
  res.status(201).json({
    status: 'success',
    data: employee,
  });
});

exports.deleteEmployee = catchAsync(async (req, res) => {
  const employee = Employee.destroy({
    where: { eid: req.params.id },
  });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.updateEmployee = catchAsync(async (req, res) => {
  const employee = await Employee.update(req.body, {
    where: { eid: req.params.id },
  });
  const newEmployee = await Employee.findOne({
    where: { eid: req.params.id },
  });
  res.status(200).json({
    status: 'success',
    data: newEmployee,
  });
});
