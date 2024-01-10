module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define(
    'Document',
    {
      PRN: {
        type: DataTypes.STRING(10),
        primaryKey: true,
        allowNull: false,
      },
      cetForm: {
        type: DataTypes.BLOB('medium'),
        field: 'cet_form',
      },
      neetScoreCard: {
        type: DataTypes.BLOB('medium'),
        field: 'neet_scorecard',
      },
      sscMarksheet: {
        type: DataTypes.BLOB('medium'),
        field: 'ssc_marksheet',
      },
      sscCertificate: {
        type: DataTypes.BLOB('medium'),
        field: 'ssc_certificate',
      },
      hscMarksheet: {
        type: DataTypes.BLOB('medium'),
        field: 'hsc_marksheet',
      },
      hscCertificate: {
        type: DataTypes.BLOB('medium'),
        field: 'hsc_certificate',
      },
      aadhar: {
        type: DataTypes.BLOB('medium'),
      },
      nationality: {
        type: DataTypes.BLOB('medium'),
      },
      domicile: {
        type: DataTypes.BLOB('medium'),
      },
      medicalFitness: {
        type: DataTypes.BLOB('medium'),
        field: 'medical_fitness',
      },
      photo: {
        type: DataTypes.BLOB('medium'),
      },
      caste: {
        type: DataTypes.BLOB('medium'),
      },
      casteValidity: {
        type: DataTypes.BLOB('medium'),
        field: 'caste_validity',
      },
      parentIncome: {
        type: DataTypes.BLOB('medium'),
        field: 'parent_income',
      },
      nonCreamyLayer: {
        type: DataTypes.BLOB('medium'),
        field: 'non_creamy_layer',
      },
      tc: {
        type: DataTypes.BLOB('medium'),
      },
      educationGapAffidavit: {
        type: DataTypes.BLOB('medium'),
        field: 'education_gap_affidavit',
      },
      ews: {
        type: DataTypes.BLOB('medium'),
      },
      minorityDeclaration: {
        type: DataTypes.BLOB('medium'),
        field: 'minority_declaration',
      },
      disability: {
        type: DataTypes.BLOB('medium'),
      },
      migration: {
        type: DataTypes.BLOB('medium'),
      },
      other: {
        type: DataTypes.BLOB('medium'),
      },
      verified: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      verifiedBy: {
        type: DataTypes.TEXT,
        field: 'verified_by',
        allowNull: true,
      },
    },
    {
      tableName: 'documents',
      timestamps: false, // Set this to false if you don't want timestamps fields
    }
  );

  Document.associate = (models) => {
    Document.belongsTo(models.Student, {
      foreignKey: 'PRN',
      onDelete: 'CASCADE',
    });
  };

  return Document;
};
