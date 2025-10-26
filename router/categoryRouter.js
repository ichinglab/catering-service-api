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
router.get('/api/v1/category', getAllCategory);
router.delete('/api/v1/category/:id', tokenVeryfiy, deleteCategory);
router.patch('/api/v1/category/:id', tokenVeryfiy, updateCategory);

export default router;
