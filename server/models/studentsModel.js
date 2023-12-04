module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define(
    'Student',
    {
      PRN: {
        type: DataTypes.STRING(14),
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      gender: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      dob: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      phone: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      parentphone: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      email: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      course: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      admissionyear: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      dateofadmission: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      domicilestate: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      studentcategory: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      admissioncategory: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      cetmarks: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      scholarship: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
      },
      feestructure: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: 'students',
      timestamps: false,
    }
  );

  return Student;
};
