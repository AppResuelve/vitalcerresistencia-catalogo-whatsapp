module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define('Service', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
      allowNull: true,
    },
    images: {
      type: DataTypes.JSONB,
      defaultValue: [],
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'draft'),
      defaultValue: 'active',
      allowNull: false,
    },
  }, {
    tableName: 'services',
  })

  Service.associate = (models) => {
    Service.hasMany(models.ServiceVariant, { foreignKey: 'service_id', as: 'variants' })
  }

  return Service
}
