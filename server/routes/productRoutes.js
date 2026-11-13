import { Router } from 'express';
import { getFilters, getProduct, getProducts } from '../controllers/productController.js';

const router = Router();
router.get('/filters', getFilters);
router.get('/', getProducts);
router.get('/:id', getProduct);
export default router;
