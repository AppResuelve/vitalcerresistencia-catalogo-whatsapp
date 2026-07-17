module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
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
    images: {
      type: DataTypes.JSONB,
      defaultValue: [],
      allowNull: false,
    },
    retailPrice: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
      allowNull: true,
    },
    comparePrice: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    discountPercentage: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    wholesalePrice: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    wholesaleMinQty: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'draft'),
      defaultValue: 'active',
      allowNull: false,
    },
    tags: {
      type: DataTypes.JSONB,
      defaultValue: [],
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'categories',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
  }, {
    tableName: 'products',
  })

  Product.associate = (models) => {
    Product.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      as: 'category',
    })
    Product.hasMany(models.ProductSku, { foreignKey: 'product_id', as: 'skus' })
    Product.belongsToMany(models.TagValue, {
      through: 'product_tags',
      foreignKey: 'product_id',
      otherKey: 'tag_value_id',
      as: 'tagValues',
    })
  }

  return Product
}
