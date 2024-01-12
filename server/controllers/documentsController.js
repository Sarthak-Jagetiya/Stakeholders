const { sequelize, Document, Student } = require('./../models');
const catchAsync = require('./../utils/catchAsync');

exports.getAllDocuments = catchAsync(async (req, res) => {
  const docs = await Document.findAll({
    order: [['PRN', 'ASC']],
  });

  // Modify the data to include only necessary properties
  const modifiedDocs = docs.map((docData) => ({
    PRN: docData.PRN,
    cetForm: docData.cetForm ? docData.cetForm.toString('base64') : null,
    neetScoreCard: docData.neetScoreCard ? docData.neetScoreCard.toString('base64') : null,
    sscMarksheet: docData.sscMarksheet ? docData.sscMarksheet.toString('base64') : null,
    sscCertificate: docData.sscCertificate ? docData.sscCertificate.toString('base64') : null,
    hscMarksheet: docData.hscMarksheet ? docData.hscMarksheet.toString('base64') : null,
    hscCertificate: docData.hscCertificate ? docData.hscCertificate.toString('base64') : null,
    aadhar: docData.aadhar ? docData.aadhar.toString('base64') : null,
    nationality: docData.nationality ? docData.nationality.toString('base64') : null,
    domicile: docData.domicile ? docData.domicile.toString('base64') : null,
    medicalFitness: docData.medicalFitness ? docData.medicalFitness.toString('base64') : null,
    photo: docData.photo ? docData.photo.toString('base64') : null,
    caste: docData.caste ? docData.caste.toString('base64') : null,
    casteValidity: docData.casteValidity ? docData.casteValidity.toString('base64') : null,
    parentIncome: docData.parentIncome ? docData.parentIncome.toString('base64') : null,
    nonCreamyLayer: docData.nonCreamyLayer ? docData.nonCreamyLayer.toString('base64') : null,
    tc: docData.tc ? docData.tc.toString('base64') : null,
    educationGapAffidavit: docData.educationGapAffidavit,
    ews: docData.ews ? docData.ews.toString('base64') : null,
    minorityDeclaration: docData.minorityDeclaration
      ? docData.minorityDeclaration.toString('base64')
      : null,
    disability: docData.disability ? docData.disability.toString('base64') : null,
    migration: docData.migration ? docData.migration.toString('base64') : null,
    other: docData.other ? docData.other.toString('base64') : null,
    verified: docData.verified,
    verifiedBy: docData.verifiedBy,
  }));

  res.status(200).json({
    status: 'success',
    results: modifiedDocs.length,
    data: modifiedDocs,
  });
});

exports.getDocument = catchAsync(async (req, res) => {
  const docData = await Document.findOne({
    where: { PRN: req.params.id },
  });

  // Ensure that the document properties are base64-encoded
  const modifiedDoc = {
    PRN: docData.PRN,
    cetForm: docData.cetForm ? docData.cetForm.toString('base64') : null,
    neetScoreCard: docData.neetScoreCard ? docData.neetScoreCard.toString('base64') : null,
    sscMarksheet: docData.sscMarksheet ? docData.sscMarksheet.toString('base64') : null,
    sscCertificate: docData.sscCertificate ? docData.sscCertificate.toString('base64') : null,
    hscMarksheet: docData.hscMarksheet ? docData.hscMarksheet.toString('base64') : null,
    hscCertificate: docData.hscCertificate ? docData.hscCertificate.toString('base64') : null,
    aadhar: docData.aadhar ? docData.aadhar.toString('base64') : null,
    nationality: docData.nationality ? docData.nationality.toString('base64') : null,
    domicile: docData.domicile ? docData.domicile.toString('base64') : null,
    medicalFitness: docData.medicalFitness ? docData.medicalFitness.toString('base64') : null,
    photo: docData.photo ? docData.photo.toString('base64') : null,
    caste: docData.caste ? docData.caste.toString('base64') : null,
    casteValidity: docData.casteValidity ? docData.casteValidity.toString('base64') : null,
    parentIncome: docData.parentIncome ? docData.parentIncome.toString('base64') : null,
    nonCreamyLayer: docData.nonCreamyLayer ? docData.nonCreamyLayer.toString('base64') : null,
    tc: docData.tc ? docData.tc.toString('base64') : null,
    educationGapAffidavit: docData.educationGapAffidavit,
    ews: docData.ews ? docData.ews.toString('base64') : null,
    minorityDeclaration: docData.minorityDeclaration
      ? docData.minorityDeclaration.toString('base64')
      : null,
    disability: docData.disability ? docData.disability.toString('base64') : null,
    migration: docData.migration ? docData.migration.toString('base64') : null,
    other: docData.other ? docData.other.toString('base64') : null,
    verified: docData.verified,
    verifiedBy: docData.verifiedBy,
  };

  res.status(200).json({
    status: 'success',
    data: {
      data: modifiedDoc,
    },
  });
});

exports.createDocument = catchAsync(async (req, res) => {
  // Convert each document property to Buffer from base64
  const createData = {
    PRN: req.body.PRN,
    cetForm: req.body.cetForm ? Buffer.from(req.body.cetForm, 'base64') : null,
    neetScoreCard: req.body.neetScoreCard ? Buffer.from(req.body.neetScoreCard, 'base64') : null,
    sscMarksheet: req.body.sscMarksheet ? Buffer.from(req.body.sscMarksheet, 'base64') : null,
    sscCertificate: req.body.sscCertificate ? Buffer.from(req.body.sscCertificate, 'base64') : null,
    hscMarksheet: req.body.hscMarksheet ? Buffer.from(req.body.hscMarksheet, 'base64') : null,
    hscCertificate: req.body.hscCertificate ? Buffer.from(req.body.hscCertificate, 'base64') : null,
    aadhar: req.body.aadhar ? Buffer.from(req.body.aadhar, 'base64') : null,
    nationality: req.body.nationality ? Buffer.from(req.body.nationality, 'base64') : null,
    domicile: req.body.domicile ? Buffer.from(req.body.domicile, 'base64') : null,
    medicalFitness: req.body.medicalFitness ? Buffer.from(req.body.medicalFitness, 'base64') : null,
    photo: req.body.photo ? Buffer.from(req.body.photo, 'base64') : null,
    caste: req.body.caste ? Buffer.from(req.body.caste, 'base64') : null,
    casteValidity: req.body.casteValidity ? Buffer.from(req.body.casteValidity, 'base64') : null,
    parentIncome: req.body.parentIncome ? Buffer.from(req.body.parentIncome, 'base64') : null,
    nonCreamyLayer: req.body.nonCreamyLayer ? Buffer.from(req.body.nonCreamyLayer, 'base64') : null,
    tc: req.body.tc ? Buffer.from(req.body.tc, 'base64') : null,
    educationGapAffidavit: req.body.educationGapAffidavit
      ? Buffer.from(req.body.educationGapAffidavit, 'base64')
      : null,
    ews: req.body.ews ? Buffer.from(req.body.ews, 'base64') : null,
    minorityDeclaration: req.body.minorityDeclaration
      ? Buffer.from(req.body.minorityDeclaration, 'base64')
      : null,
    disability: req.body.disability ? Buffer.from(req.body.disability, 'base64') : null,
    migration: req.body.migration ? Buffer.from(req.body.migration, 'base64') : null,
    other: req.body.other ? Buffer.from(req.body.other, 'base64') : null,
    verified: req.body.verified,
    verifiedBy: req.body.verified ? req.body.verifiedBy : '',
  };

  const document = await Document.create(createData);

  res.status(201).json({
    status: 'success',
    data: document,
  });
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
  // Convert each document property to Buffer from base64
  const updateData = {
    cetForm: req.body.cetForm ? Buffer.from(req.body.cetForm, 'base64') : null,
    neetScoreCard: req.body.neetScoreCard ? Buffer.from(req.body.neetScoreCard, 'base64') : null,
    sscMarksheet: req.body.sscMarksheet ? Buffer.from(req.body.sscMarksheet, 'base64') : null,
    sscCertificate: req.body.sscCertificate ? Buffer.from(req.body.sscCertificate, 'base64') : null,
    hscMarksheet: req.body.hscMarksheet ? Buffer.from(req.body.hscMarksheet, 'base64') : null,
    hscCertificate: req.body.hscCertificate ? Buffer.from(req.body.hscCertificate, 'base64') : null,
    aadhar: req.body.aadhar ? Buffer.from(req.body.aadhar, 'base64') : null,
    nationality: req.body.nationality ? Buffer.from(req.body.nationality, 'base64') : null,
    domicile: req.body.domicile ? Buffer.from(req.body.domicile, 'base64') : null,
    medicalFitness: req.body.medicalFitness ? Buffer.from(req.body.medicalFitness, 'base64') : null,
    photo: req.body.photo ? Buffer.from(req.body.photo, 'base64') : null,
    caste: req.body.caste ? Buffer.from(req.body.caste, 'base64') : null,
    casteValidity: req.body.casteValidity ? Buffer.from(req.body.casteValidity, 'base64') : null,
    parentIncome: req.body.parentIncome ? Buffer.from(req.body.parentIncome, 'base64') : null,
    nonCreamyLayer: req.body.nonCreamyLayer ? Buffer.from(req.body.nonCreamyLayer, 'base64') : null,
    tc: req.body.tc ? Buffer.from(req.body.tc, 'base64') : null,
    educationGapAffidavit: req.body.educationGapAffidavit
      ? Buffer.from(req.body.educationGapAffidavit, 'base64')
      : null,
    ews: req.body.ews ? Buffer.from(req.body.ews, 'base64') : null,
    minorityDeclaration: req.body.minorityDeclaration
      ? Buffer.from(req.body.minorityDeclaration, 'base64')
      : null,
    disability: req.body.disability ? Buffer.from(req.body.disability, 'base64') : null,
    migration: req.body.migration ? Buffer.from(req.body.migration, 'base64') : null,
    other: req.body.other ? Buffer.from(req.body.other, 'base64') : null,
    verified: req.body.verified,
    verifiedBy: req.body.verified ? req.body.verifiedBy : '',
  };

  const updatedDocCount = await Document.update(updateData, {
    where: { PRN: req.params.id },
  });

  if (updatedDocCount[0] === 0) {
    // If no documents were updated, handle the error
    return res.status(404).json({
      status: 'error',
      message: 'Document not found',
    });
  }

  const updatedDoc = await Document.findOne({
    where: { PRN: req.params.id },
  });

  res.status(200).json({
    status: 'success',
    data: updatedDoc,
  });
});
