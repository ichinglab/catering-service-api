import express from 'express';
import {
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  createProduct,
} from '../controler/productControler.js';

//init router
const router = express.Router();
//all student routers
router.post('/api/v1/product', createProduct);
router.get('/api/v1/product', getAllProducts);
router.get('/api/v1/product/:id', getSingleProduct);
router.delete('/api/v1/product/:id', deleteProduct);
router.put('/api/v1/product/:id', updateProduct);

export default router;
