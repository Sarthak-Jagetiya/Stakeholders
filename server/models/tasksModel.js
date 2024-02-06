module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define(
    'Task',
    {
      tid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      task_name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      due_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      reminder_before: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      eid: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      status: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      remarks: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      doc: {
        type: DataTypes.BLOB('medium'),
      },
    },
    {
      tableName: 'tasks',
      timestamps: false,
    }
  );

  // Define association with the Employee model
  Task.belongsTo(sequelize.models.Employee, {
    foreignKey: 'eid',
    onDelete: 'CASCADE',
  });

  return Task;
};
