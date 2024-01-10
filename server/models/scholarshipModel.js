module.exports = (sequelize, DataTypes) => {
  const Scholarship = sequelize.define(
    'Scholarship',
    {
      PRN: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      transactionID: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      installment: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      remark: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: 'scholarship',
      timestamps: false, // Set this to false if you don't want timestamps fields
    }
  );

  return Scholarship;
};
