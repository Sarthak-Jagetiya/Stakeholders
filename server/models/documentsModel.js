module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define(
    'Document',
    {
      PRN: {
        type: DataTypes.STRING(10),
        primaryKey: true,
        allowNull: false,
      },
      aadhar: {
        type: DataTypes.BLOB('medium'),
        allowNull: false,
      },
      nationality: {
        type: DataTypes.BLOB('medium'),
        allowNull: false,
      },
      domicile: {
        type: DataTypes.BLOB('medium'),
        allowNull: false,
      },
      ssc: {
        type: DataTypes.BLOB('medium'),
        allowNull: false,
      },
      hsc: {
        type: DataTypes.BLOB('medium'),
        allowNull: false,
      },
      medicalfitness: {
        type: DataTypes.BLOB('medium'),
        allowNull: false,
      },
      photo: {
        type: DataTypes.BLOB('medium'),
        allowNull: false,
      },
      verified: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      verifiedby: {
        type: DataTypes.TEXT,
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
