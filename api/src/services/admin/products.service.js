const {
  Product,
  Category,
  ProductSku,
  AttributeValue,
  Attribute,
  TagValue,
  Tag,
  sequelize,
} = require("../../models");

const { resolveDiscountFields } = require('../../utils/discount')
const { generateSkuCode } = require('../../utils/skuGenerator')
const { applyUnitPricing } = require('../../utils/unitPricing')

const skuInclude = {
  model: ProductSku,
  as: "skus",
  include: [
    {
      model: AttributeValue,
      as: "attributeValues",
      through: { attributes: [] },
      include: [{ model: Attribute, as: "attribute" }],
    },
  ],
  order: [["sort_order", "ASC"]],
};

const list = async (query = {}) => {
  const { page = 1, limit = 20, search, categoryId, status, tagId } = query;
  const offset = (page - 1) * limit;

  const where = {};
  if (search) {
    where[require("sequelize").Op.or] = [
      { name: { [require("sequelize").Op.iLike]: `%${search}%` } },
      { description: { [require("sequelize").Op.iLike]: `%${search}%` } },
    ];
  }
  if (categoryId) where.categoryId = categoryId;
  if (status) where.status = status;

  const include = [
    { model: Category, as: "category", attributes: ["id", "name", "slug"] },
    skuInclude,
    { model: TagValue, as: "tagValues", include: [{ model: Tag, as: "tag" }] },
  ];

  if (tagId) {
    include[2].where = { id: Number(tagId) };
  }

  const { count, rows } = await Product.findAndCountAll({
    where,
    include,
    distinct: true,
    order: [["name", "ASC"]],
    limit: Number(limit),
    offset,
  });

  rows.forEach(applyUnitPricing);

  return {
    products: rows,
    total: count,
    page: Number(page),
    totalPages: Math.ceil(count / limit),
  };
};

const getById = async (id) => {
  const numericId = Number(id)
  if (!Number.isInteger(numericId) || numericId <= 0) {
    throw Object.assign(new Error("ID de producto inválido"), { status: 400 });
  }
  const product = await Product.findByPk(numericId, {
    include: [
      { model: Category, as: "category", attributes: ["id", "name", "slug"] },
      skuInclude,
      { model: TagValue, as: "tagValues", include: [{ model: Tag, as: "tag" }] },
    ],
  });
  if (!product) {
    throw Object.assign(new Error("Producto no encontrado"), { status: 404 });
  }
  applyUnitPricing(product);
  return product;
};

const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 255);
};

const syncSkus = async (productId, skus = [], basePrices, transaction) => {
  const skuIds = [];

  for (const s of skus) {
    const skuData = {
      productId: productId,
      retailPrice: s.retailPrice || basePrices?.retailPrice || 0,
      wholesalePrice: s.wholesalePrice ?? basePrices?.wholesalePrice ?? null,
      wholesaleMinQty: s.wholesaleMinQty ?? basePrices?.wholesaleMinQty ?? null,
      stock: s.stock ?? 0,
      sku: s.sku ?? null,
      images: s.images ?? [],
      sortOrder: s.sortOrder ?? 0,
      status: s.status || "active",
    };

    let sku;
    if (s.id) {
      sku = await ProductSku.findByPk(s.id, { transaction });
      if (sku && sku.productId === productId) {
        await sku.update(skuData, { transaction });
      } else {
        sku = await ProductSku.create(skuData, { transaction });
      }
    } else {
      sku = await ProductSku.create(skuData, { transaction });
    }

    skuIds.push(sku.id);

    if (s.attributeValueIds && Array.isArray(s.attributeValueIds)) {
      const currentLinks = await sku.getAttributeValues({ transaction });
      const currentIds = currentLinks.map((v) => v.id);
      const toAdd = s.attributeValueIds.filter(
        (id) => !currentIds.includes(id),
      );
      const toRemove = currentIds.filter(
        (id) => !s.attributeValueIds.includes(id),
      );

      if (toRemove.length > 0) {
        await sku.removeAttributeValues(toRemove, { transaction });
      }
      if (toAdd.length > 0) {
        await sku.addAttributeValues(toAdd, { transaction });
      }
    }
  }

  await ProductSku.destroy({
    where: { productId, id: { [require("sequelize").Op.notIn]: skuIds } },
    transaction,
  });
};

const create = async (data) => {
  if (!data.slug && data.name) {
    data.slug = slugify(data.name);
  }

  if (data.slug) {
    const existing = await Product.findOne({ where: { slug: data.slug } });
    if (existing) {
      throw Object.assign(new Error('Ya existe un producto con ese slug'), { status: 400 });
    }
  }

  const { comparePrice, discountPercentage } = resolveDiscountFields(
    data.retailPrice,
    data.comparePrice,
    data.discountPercentage,
  );
  data.comparePrice = comparePrice;
  data.discountPercentage = discountPercentage;

  const { skus, tagIds, ...productData } = data;

  const result = await sequelize.transaction(async (t) => {
    const product = await Product.create(productData, { transaction: t });
    if (tagIds && tagIds.length > 0) {
      await product.setTagValues(tagIds, { transaction: t });
    }
    if (skus && skus.length > 0) {
      const basePrices = { retailPrice: product.retailPrice, wholesalePrice: product.wholesalePrice, wholesaleMinQty: product.wholesaleMinQty }
      await syncSkus(product.id, skus, basePrices, t);
    } else {
      // Producto simple: crear/actualizar SKU base
      const [baseSku] = await ProductSku.findOrCreate({
        where: { productId: product.id },
        defaults: {
          productId: product.id,
          retailPrice: product.retailPrice || 0,
          wholesalePrice: product.wholesalePrice,
          wholesaleMinQty: product.wholesaleMinQty,
          stock: 0, sku: null, images: [], sortOrder: 0, status: 'active',
        },
        transaction: t,
      })
      if (!baseSku._options?.isNewRecord) {
        await baseSku.update({
          retailPrice: product.retailPrice || 0,
          wholesalePrice: product.wholesalePrice,
          wholesaleMinQty: product.wholesaleMinQty,
        }, { transaction: t })
      }
      // Asegurar que no tenga attributeValues (es base)
      await baseSku.setAttributeValues([], { transaction: t })
    }
    return Product.findByPk(product.id, {
      include: [skuInclude],
      transaction: t,
    });
  });

  return result;
};

const update = async (id, data) => {
  const product = await getById(id);
  if (!data.slug && data.name) {
    data.slug = slugify(data.name);
  }

  if (data.slug && data.slug !== product.slug) {
    const existing = await Product.findOne({ where: { slug: data.slug } })
    if (existing && existing.id !== product.id) {
      throw Object.assign(new Error('Ya existe un producto con ese slug'), { status: 400 })
    }
  }

  const { comparePrice, discountPercentage } = resolveDiscountFields(
    data.retailPrice ?? product.retailPrice,
    data.comparePrice,
    data.discountPercentage,
  );
  data.comparePrice = comparePrice;
  data.discountPercentage = discountPercentage;

  const { skus, tagIds, ...productData } = data;

  const result = await sequelize.transaction(async (t) => {
    await product.update(productData, { transaction: t });
    if (tagIds !== undefined) {
      await product.setTagValues(tagIds, { transaction: t });
    }
    if (skus && Array.isArray(skus)) {
      const basePrices = { retailPrice: product.retailPrice, wholesalePrice: product.wholesalePrice, wholesaleMinQty: product.wholesaleMinQty }
      await syncSkus(product.id, skus, basePrices, t);
    } else {
      // Producto simple: crear/actualizar SKU base
      const [baseSku] = await ProductSku.findOrCreate({
        where: { productId: product.id },
        defaults: {
          productId: product.id,
          retailPrice: product.retailPrice || 0,
          wholesalePrice: product.wholesalePrice,
          wholesaleMinQty: product.wholesaleMinQty,
          stock: 0, sku: null, images: [], sortOrder: 0, status: 'active',
        },
        transaction: t,
      })
      if (!baseSku._options?.isNewRecord) {
        await baseSku.update({
          retailPrice: product.retailPrice || 0,
          wholesalePrice: product.wholesalePrice,
          wholesaleMinQty: product.wholesaleMinQty,
        }, { transaction: t })
      }
      await baseSku.setAttributeValues([], { transaction: t })
    }
    return Product.findByPk(id, { include: [skuInclude], transaction: t });
  });

  return result;
};

const remove = async (id) => {
  const product = await getById(id);
  return product.destroy();
};

const CHUNK = 150;

const bulkCreate = async (products, categoryId) => {
  const hasVariants = products.some(p => p.skus?.length > 0)

  if (!hasVariants) {
    // Fast path: productos simples, bulkCreate
    const existingSlugs = new Set(
      (await Product.findAll({ attributes: ["slug"] })).map((p) => p.slug),
    )
    const used = new Set([...existingSlugs])
    const warnings = []

    const rows = products.map((p) => {
      const base = p.slug || slugify(p.name)
      let slug = base
      let suffix = 97
      while (used.has(slug)) { slug = `${base}-${String.fromCharCode(suffix)}`; suffix++ }
      used.add(slug)
      if (slug !== base) warnings.push({ name: p.name, slug })
      const retailPrice = Number(p.price) || 0
      const { comparePrice, discountPercentage } = resolveDiscountFields(retailPrice, p.comparePrice, p.discountPercentage)
      return {
        name: p.name, slug, retailPrice, status: "draft", categoryId: categoryId || null,
        ...(p.description != null && p.description !== "" && { description: String(p.description) }),
        ...(discountPercentage != null && { discountPercentage }),
        ...(comparePrice != null && { comparePrice }),
        ...(p.wholesalePrice != null && p.wholesalePrice !== "" && { wholesalePrice: Number(p.wholesalePrice) }),
        ...(p.wholesaleMinQty != null && p.wholesaleMinQty !== "" && { wholesaleMinQty: Number(p.wholesaleMinQty) }),
        ...(p.images && { images: Array.isArray(p.images) ? p.images : [p.images] }),
      }
    })

    const t = await sequelize.transaction()
    try {
      for (let i = 0; i < rows.length; i += CHUNK) {
        const chunk = rows.slice(i, i + CHUNK)
        const created = await Product.bulkCreate(chunk, { validate: true, transaction: t })
        await ProductSku.bulkCreate(created.map((p) => ({
          productId: p.id, retailPrice: p.retailPrice || 0,
          wholesalePrice: p.wholesalePrice || null, wholesaleMinQty: p.wholesaleMinQty || null,
          stock: 0, sku: null, images: [], sortOrder: 0, status: "active",
        })), { transaction: t })
      }
      await t.commit()
    } catch (err) { await t.rollback(); throw err }
    return { created: rows.length, warnings, createdAttributes: [] }
  }

  // Slow path: productos con variantes, create individual + findOrCreate attributes
  const existingSlugs = new Set((await Product.findAll({ attributes: ["slug"] })).map((p) => p.slug))
  const used = new Set([...existingSlugs])
  const warnings = []
  const createdAttributes = []
  let createdCount = 0

  const t = await sequelize.transaction()
  try {
    for (const p of products) {
      // Slug
      const base = p.slug || slugify(p.name)
      let slug = base
      let suffix = 97
      while (used.has(slug)) { slug = `${base}-${String.fromCharCode(suffix)}`; suffix++ }
      used.add(slug)
      if (slug !== base) warnings.push({ name: p.name, slug })

      const retailPrice = Number(p.price) || 0
      const { comparePrice, discountPercentage } = resolveDiscountFields(retailPrice, p.comparePrice, p.discountPercentage)

      const productData = {
        name: p.name, slug, retailPrice, status: "draft", categoryId: categoryId || null,
        ...(p.description != null && p.description !== "" && { description: String(p.description) }),
        ...(discountPercentage != null && { discountPercentage }),
        ...(comparePrice != null && { comparePrice }),
        ...(p.wholesalePrice != null && p.wholesalePrice !== "" && { wholesalePrice: Number(p.wholesalePrice) }),
        ...(p.wholesaleMinQty != null && p.wholesaleMinQty !== "" && { wholesaleMinQty: Number(p.wholesaleMinQty) }),
        ...(p.images && { images: Array.isArray(p.images) ? p.images : [p.images] }),
      }
      const product = await Product.create(productData, { transaction: t })
      createdCount++

      const basePrices = { retailPrice, wholesalePrice: productData.wholesalePrice, wholesaleMinQty: productData.wholesaleMinQty }

      if (p.skus?.length > 0) {
        // Build resolvedAttributes for SKU code generation
        const resolvedAttributes = []
        for (const sku of p.skus) {
          const attributeValueIds = []
          if (sku.attrValues?.length > 0) {
            for (const { attrName, value } of sku.attrValues) {
              const [attr, attrCreated] = await Attribute.findOrCreate({
                where: { name: { [require('sequelize').Op.iLike]: attrName } },
                defaults: { name: attrName, sortOrder: 0 },
                transaction: t,
              })
              if (attrCreated && !createdAttributes.includes(attr.name)) {
                createdAttributes.push(attr.name)
              }
              const [attrValue] = await AttributeValue.findOrCreate({
                where: { attributeId: attr.id, value: { [require('sequelize').Op.iLike]: value } },
                defaults: { attributeId: attr.id, value, sortOrder: 0 },
                transaction: t,
              })
              attributeValueIds.push(attrValue.id)
              // Track for SKU code generation
              let resolved = resolvedAttributes.find(a => a.id === attr.id)
              if (!resolved) { resolved = { id: attr.id, name: attr.name, values: [] }; resolvedAttributes.push(resolved) }
              if (!resolved.values.find(v => v.id === attrValue.id)) resolved.values.push({ id: attrValue.id, value: attrValue.value })
            }
          }
          await syncSkus(product.id, [{
            retailPrice: sku.retailPrice || retailPrice,
            wholesalePrice: sku.wholesalePrice ?? basePrices.wholesalePrice,
            wholesaleMinQty: sku.wholesaleMinQty ?? basePrices.wholesaleMinQty,
            stock: sku.stock || 0,
            sku: sku.sku?.trim() || (attributeValueIds.length > 0 ? generateSkuCode(product.name, attributeValueIds, resolvedAttributes) : null),
            images: sku.images || [],
            sortOrder: sku.sortOrder || 0,
            status: sku.status || 'active',
            attributeValueIds,
          }], basePrices, t)
        }
      } else {
        // Producto simple con variantes en el batch → SKU base
        await ProductSku.create({
          productId: product.id, retailPrice: retailPrice || 0,
          wholesalePrice: productData.wholesalePrice || null,
          wholesaleMinQty: productData.wholesaleMinQty || null,
          stock: 0, sku: null, images: [], sortOrder: 0, status: 'active',
        }, { transaction: t })
      }
    }
    await t.commit()
  } catch (err) { await t.rollback(); throw err }

  return { created: createdCount, warnings, createdAttributes }
};

module.exports = { list, getById, create, update, remove, bulkCreate };
