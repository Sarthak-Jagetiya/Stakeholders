module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define(
    'Employee',
    {
      eid: {
        type: DataTypes.STRING(10),
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
      phone: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      email: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      adhar: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      designation: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      emergencycontact: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      college: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: 'employee',
      timestamps: false, // Set this to false if you don't want timestamps fields
    }
  );

  return Employee;
};
