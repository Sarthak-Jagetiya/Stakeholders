const { sequelize, Result, Student } = require('../models');
const catchAsync = require('../utils/catchAsync');

exports.getAllResults = catchAsync(async (req, res) => {
  const result = await Result.findAll({
    order: [['rid', 'ASC']],
  });

  // Modify the data to include only necessary properties
  const modifiedResult = result.map((r) => ({
    rid: r.rid,
    PRN: r.PRN,
    doc: r.doc.toString('base64'), // Assuming the document is stored as Buffer in the 'doc' field
    remark: r.remark,
  }));

  res.status(200).json({
    status: 'success',
    results: modifiedResult.length,
    data: modifiedResult,
  });
});

exports.getResult = catchAsync(async (req, res) => {
  const result = await Result.findOne({
    where: { rid: req.params.id },
  });

  // Ensure that the 'result' property is base64-encoded
  const modifiedResult = {
    rid: result.rid,
    PRN: result.PRN,
    doc: result.doc.toString('base64'),
    remark: result.remark,
    // Add other properties as needed
  };

  res.status(200).json({
    status: 'success',
    data: {
      data: modifiedResult,
    },
  });
});

exports.createResult = catchAsync(async (req, res) => {
  const student = await Student.findOne({ where: { PRN: req.body.PRN } });
  if (!student) {
    return res.status(399).json({
      status: 'error',
      message: 'Student with the provided PRN does not exist.',
    });
  }
  // Assuming req.body.docData contains the document data
  // Ensure that the 'docData' property is directly stored as Buffer
  req.body.doc = Buffer.from(req.body.docData, 'base64');

  const result = await Result.create(req.body);

  res.status(201).json({
    status: 'success',
    data: result,
  });
});

exports.deleteResult = catchAsync(async (req, res) => {
  const result = Result.destroy({
    where: { rid: req.params.id },
  });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.updateResult = catchAsync(async (req, res) => {
  // Ensure that the 'docData' property is base64-decoded and stored as Buffer
  if (req.body.docData) {
    req.body.doc = Buffer.from(req.body.docData, 'base64');
    // Remove the 'docData' property from req.body to avoid duplicate storage
    delete req.body.docData;
  }

  const result = await Result.update(req.body, {
    where: { rid: req.params.id },
  });

  if (result[0] === 0) {
    // If no documents were updated, handle the error
    return res.status(404).json({
      status: 'error',
      message: 'Document not found',
    });
  }

  const updatedResult = await Result.findOne({
    where: { rid: req.params.id },
  });

  res.status(200).json({
    status: 'success',
    data: updatedResult,
  });
});
