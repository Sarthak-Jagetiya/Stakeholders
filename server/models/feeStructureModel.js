module.exports = (sequelize, DataTypes) => {
  const FeeStructure = sequelize.define(
    'FeeStructure',
    {
      code: {
        type: DataTypes.STRING(10),
        allowNull: false,
        primaryKey: true,
      },
      academicyear: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      category: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      scholarship: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        defaultValue: 0,
      },
      tuitionfees: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      eligibilityregistration: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      universityfees: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      library: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      collegeexam: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      developmentfee: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      other: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      cautionmoney: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
    },
    {
      tableName: 'feestructure',
      timestamps: false,
    }
  );

  return FeeStructure;
};
