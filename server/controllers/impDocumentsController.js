const { sequelize, impDocument } = require('../models');
const catchAsync = require('../utils/catchAsync');

exports.getAllDocuments = catchAsync(async (req, res) => {
  const docs = await impDocument.findAll({
    order: [['did', 'ASC']],
  });

  // Modify the data to include only necessary properties
  const modifiedDocs = docs.map((docData) => ({
    did: docData.did,
    doc: docData.doc.toString('base64'), // Assuming the document is stored as Buffer in the 'doc' field
    remark: docData.remark,
    // Add other properties as needed
  }));

  res.status(200).json({
    status: 'success',
    results: modifiedDocs.length,
    data: modifiedDocs,
  });
});

exports.getDocument = catchAsync(async (req, res) => {
  const docData = await impDocument.findOne({
    where: { did: req.params.id },
  });

  // Ensure that the 'docData' property is base64-encoded
  const modifiedDoc = {
    did: docData.did,
    doc: docData.doc.toString('base64'),
    remark: docData.remark,
    // Add other properties as needed
  };

  res.status(200).json({
    status: 'success',
    data: {
      data: modifiedDoc,
    },
  });
});

exports.createDocument = catchAsync(async (req, res) => {
  // Assuming req.body.docData contains the document data
  // Ensure that the 'docData' property is directly stored as Buffer
  req.body.doc = Buffer.from(req.body.docData, 'base64');

  const document = await impDocument.create(req.body);

  res.status(201).json({
    status: 'success',
    data: document,
  });
});

exports.deleteDocument = catchAsync(async (req, res) => {
  const doc = impDocument.destroy({
    where: { did: req.params.id },
  });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.updateDocument = catchAsync(async (req, res) => {
  // Ensure that the 'docData' property is base64-decoded and stored as Buffer
  if (req.body.docData) {
    req.body.doc = Buffer.from(req.body.docData, 'base64');
    // Remove the 'docData' property from req.body to avoid duplicate storage
    delete req.body.docData;
  }

  const updatedDocCount = await impDocument.update(req.body, {
    where: { did: req.params.id },
  });

  if (updatedDocCount[0] === 0) {
    // If no documents were updated, handle the error
    return res.status(404).json({
      status: 'error',
      message: 'Document not found',
    });
  }

  const updatedDoc = await impDocument.findOne({
    where: { did: req.params.id },
  });

  res.status(200).json({
    status: 'success',
    data: updatedDoc,
  });
});
