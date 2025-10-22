import express from 'express';
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
} from '../controler/orderControler.js';
import tokenVeryfiy from '../middleware/tokenVerify.js';

const router = express.Router();

router.post('/api/v1/order', tokenVeryfiy, createOrder);
router.get('/api/v1/order', tokenVeryfiy, getAllOrders);
router.delete('/api/v1/order/:id', tokenVeryfiy, deleteOrder);
router.patch('/api/v1/order/:id', tokenVeryfiy, updateOrder);
router.get('/api/v1/order/:id', tokenVeryfiy, getOrderById);

export default router;
