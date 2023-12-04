const { sequelize, Document, Student } = require('./../models');
const catchAsync = require('./../utils/catchAsync');

exports.getAllDocuments = catchAsync(async (req, res) => {
  const doc = await Document.findAll({
    order: [['PRN', 'ASC']],
  });
  res.status(200).json({
    status: 'success',
    results: doc.length,
    data: doc,
  });
});

exports.getDocument = catchAsync(async (req, res) => {
  const doc = await Document.findOne({
    where: { PRN: req.params.id },
  });
  res.status(200).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

exports.createDocument = catchAsync(async (req, res) => {
  const student = await Student.findOne({ where: { PRN: req.body.PRN } });
  if (!student) {
    return res.status(400).json({
      status: 'error',
      message: 'Student with the provided PRN does not exist.',
    });
  }
  const doc = await Document.findOne({ where: { PRN: req.body.PRN } });
  if (doc) {
    return res.status(399).json({
      status: 'error',
      message: 'Student entry with the provided PRN already exists.',
    });
  }
  try {
    const document = await Document.create(req.body);

    res.status(201).json({
      status: 'success',
      data: document,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: 'error',
      message: 'Failed to create the document',
    });
  }
});

exports.deleteDocument = catchAsync(async (req, res) => {
  const doc = Document.destroy({
    where: { PRN: req.params.id },
  });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.updateDocument = catchAsync(async (req, res) => {
  const doc1 = await Document.update(req.body, {
    where: { PRN: req.params.id },
  });
  const doc = await Document.findOne({
    where: { PRN: req.params.id },
  });
  res.status(200).json({
    status: 'success',
    data: doc,
  });
});
