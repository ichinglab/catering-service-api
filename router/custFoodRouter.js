import express from 'express';
import {
  createMealPackage,
  getAllMealPackages,
  getCustomizedFoodByUserId,
  updateMealPackage,
} from '../controler/custFoodController.js';
import tokenVeryfiy from '../middleware/tokenVerify.js';

const router = express.Router();

router.post('/api/v1/cust-food', tokenVeryfiy, createMealPackage);

router.get('/api/v1/cust-food', tokenVeryfiy, getAllMealPackages);

router.get('/api/v1/cust-food/:id', tokenVeryfiy, getCustomizedFoodByUserId);

router.patch('/api/v1/cust-food/:id', tokenVeryfiy, updateMealPackage);

export default router;
