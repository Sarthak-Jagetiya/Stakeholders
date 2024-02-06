module.exports = (sequelize, DataTypes) => {
  const Result = sequelize.define(
    'Result',
    {
      rid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      PRN: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      doc: {
        type: DataTypes.BLOB('long'),
        allowNull: false,
      },
      remark: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: 'result',
      timestamps: false,
    }
  );

  return Result;
};
