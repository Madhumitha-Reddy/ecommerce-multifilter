import { findProductById, getFilterMetadata, listProducts, parseProductQuery } from '../services/productService.js';

export async function getProducts(req, res, next) {
  try { res.json(await listProducts(parseProductQuery(req.query))); } catch (error) { next(error); }
}

export async function getFilters(req, res, next) {
  try { res.json({ success: true, filters: await getFilterMetadata() }); } catch (error) { next(error); }
}

export async function getProduct(req, res, next) {
  try { res.json(await findProductById(req.params.id)); } catch (error) { next(error); }
}
