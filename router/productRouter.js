import express from 'express';
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
} from '../controler/productControler.js';
import tokenVeryfiy from '../middleware/tokenVerify.js';

//init router
const router = express.Router();
//all student routers
router.post('/api/v1/product', tokenVeryfiy, createProduct);
router.get('/api/v1/product', getAllProducts);
router.get('/api/v1/product/:id', getSingleProduct);
router.delete('/api/v1/product/:id', tokenVeryfiy, deleteProduct);
router.patch('/api/v1/product/:id', tokenVeryfiy, updateProduct);

export default router;
