import express from 'express';
import {
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  productCreate,
  updateProduct,
} from '../controler/productControler.js';

//init router
const router = express.Router();
//all student routers
router.post('/api/v1/product', productCreate);
router.get('/api/v1/product', getAllProducts);
router.get('/api/v1/product/:id', getSingleProduct);
router.delete('/api/v1/product/:id', deleteProduct);
router.put('/api/v1/product/:id', updateProduct);

export default router;
