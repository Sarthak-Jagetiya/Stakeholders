module.exports = (sequelize, DataTypes) => {
  const impDocument = sequelize.define(
    'impDocument',
    {
      did: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      doc: {
        type: DataTypes.BLOB('long'),
      },
      remark: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: 'impdocuments',
      timestamps: false, // Set this to false if you don't want timestamps fields
    }
  );

  return impDocument;
};
