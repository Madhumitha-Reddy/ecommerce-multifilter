import mongoose from 'mongoose';
import Product from '../models/Product.js';

const sortOptions = {
  recommended: { rating: -1, createdAt: -1, _id: 1 },
  price_asc: { price: 1, _id: 1 },
  price_desc: { price: -1, _id: 1 },
  rating_desc: { rating: -1, createdAt: -1, _id: 1 }
};

function optionalNumber(value, name, { min = 0, max = Infinity } = {}) {
  if (value === undefined || value === null || value === '') return undefined;
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) {
    const error = new Error(`${name} must be a number between ${min} and ${max === Infinity ? 'infinity' : max}.`);
    error.status = 400;
    throw error;
  }
  return number;
}

export function parseProductQuery(query) {
  const categories = query.categories === undefined || query.categories === ''
    ? [] : String(query.categories).split(',').map((value) => value.trim()).filter(Boolean);
  const minPrice = optionalNumber(query.minPrice, 'minPrice');
  const maxPrice = optionalNumber(query.maxPrice, 'maxPrice');
  const minRating = optionalNumber(query.minRating, 'minRating', { min: 1, max: 5 });
  const page = optionalNumber(query.page, 'page', { min: 1 }) ?? 1;
  const limit = optionalNumber(query.limit, 'limit', { min: 1, max: 100 }) ?? 12;
  const sortBy = query.sortBy || 'recommended';
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    const error = new Error('minPrice cannot be greater than maxPrice.'); error.status = 400; throw error;
  }
  if (!Object.hasOwn(sortOptions, sortBy)) {
    const error = new Error('sortBy must be recommended, price_asc, price_desc, or rating_desc.'); error.status = 400; throw error;
  }
  return { categories, minPrice, maxPrice, minRating, page, limit, sortBy };
}

export async function getFilterMetadata() {
  const [categories, priceBounds] = await Promise.all([
    Product.distinct('category'),
    Product.aggregate([{ $group: { _id: null, minPrice: { $min: '$price' }, maxPrice: { $max: '$price' } } }])
  ]);
  const bounds = priceBounds[0] || { minPrice: 0, maxPrice: 0 };
  return { categories: categories.sort(), minPrice: bounds.minPrice, maxPrice: bounds.maxPrice };
}

export async function listProducts(input) {
  const { categories, minPrice, maxPrice, minRating, page, limit, sortBy } = input;
  const filter = {};
  if (categories.length) filter.category = { $in: categories };
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = minPrice;
    if (maxPrice !== undefined) filter.price.$lte = maxPrice;
  }
  if (minRating !== undefined) filter.rating = { $gte: minRating };

  const [totalProducts, products, filters] = await Promise.all([
    Product.countDocuments(filter),
    Product.find(filter).sort(sortOptions[sortBy]).skip((page - 1) * limit).limit(limit).lean(),
    getFilterMetadata()
  ]);
  return { success: true, products, totalProducts, currentPage: page, totalPages: Math.ceil(totalProducts / limit), limit, filters };
}

export async function findProductById(id) {
  if (!mongoose.isValidObjectId(id)) {
    const error = new Error('Invalid product ID.'); error.status = 400; throw error;
  }
  const product = await Product.findById(id).lean();
  if (!product) { const error = new Error('Product not found.'); error.status = 404; throw error; }
  return { success: true, product };
}
