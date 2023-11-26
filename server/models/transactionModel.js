module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define(
    'Transaction',
    {
      PRN: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      scholarship: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      tuitionfees: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      eligibilityregistration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      universityfees: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      library: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      collegeexam: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      other: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      cautionmoney: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      signature: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
    },
    {
      tableName: 'transactions',
      timestamps: false, // Set this to false if you don't want timestamps fields
    }
  );

  // Associations can be added here if needed
  Transaction.associate = (models) => {
    Transaction.belongsTo(models.Student, {
      foreignKey: 'PRN',
      onDelete: 'CASCADE',
    });
  };
  return Transaction;
};
