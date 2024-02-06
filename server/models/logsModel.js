module.exports = (sequelize, DataTypes) => {
  const Logs = sequelize.define(
    'Logs',
    {
      logID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      userID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      username: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'logs',
      timestamps: false,
    }
  );

  return Logs;
};
