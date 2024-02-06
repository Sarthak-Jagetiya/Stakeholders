const { sequelize, Task, Employee } = require('../models');
const catchAsync = require('../utils/catchAsync');

exports.getAllTask = catchAsync(async (req, res) => {
  const task = await Task.findAll();

  const modifiedTask = task.map((taskData) => ({
    tid: taskData.tid,
    task_name: taskData.task_name,
    due_date: taskData.due_date,
    reminder_before: taskData.reminder_before,
    eid: taskData.eid,
    status: taskData.status,
    remarks: taskData.remarks,
    doc: taskData.doc ? taskData.doc.toString('base64') : null,
  }));

  res.status(200).json({
    status: 'success',
    results: modifiedTask.length,
    data: modifiedTask,
  });
});

exports.getTask = catchAsync(async (req, res) => {
  const task = await Task.findOne({
    where: { tid: req.params.id },
  });

  const modifiedTask = {
    tid: task.tid,
    task_name: task.task_name,
    due_date: task.due_date,
    reminder_before: task.reminder_before,
    eid: task.eid,
    status: task.status,
    remarks: task.remarks,
    doc: task.doc ? task.doc.toString('base64') : null,
  };

  res.status(200).json({
    status: 'success',
    data: {
      data: modifiedTask,
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

  const createTask = {
    tid: req.body.tid,
    task_name: req.body.task_name,
    due_date: req.body.due_date,
    reminder_before: req.body.reminder_before,
    eid: req.body.eid,
    status: req.body.status,
    remarks: req.body.remarks,
    doc: req.body.doc ? Buffer.from(req.body.doc, 'base64') : null,
  };
  const task = await Task.create(createTask);
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

  const updateTask = {
    task_name: req.body.task_name,
    due_date: req.body.due_date,
    reminder_before: req.body.reminder_before,
    eid: req.body.eid,
    status: req.body.status,
    remarks: req.body.remarks,
    doc: req.body.doc ? Buffer.from(req.body.doc, 'base64') : null,
  };
  const doc = await Task.update(updateTask, {
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
