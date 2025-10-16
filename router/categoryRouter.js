import express from 'express';
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  updateCategory,
} from '../controler/categoryControler.js';
import tokenVeryfiy from '../middleware/tokenVerify.js';

const router = express.Router();

router.post('/api/v1/category', tokenVeryfiy, createCategory);
router.get('/api/v1/category', tokenVeryfiy, getAllCategory);
router.delete('/api/v1/category/:id', deleteCategory);
router.put('/api/v1/category/:id', updateCategory);

export default router;
