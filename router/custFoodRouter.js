import express from 'express';
import {
  createMealPackage,
  getAllMealPackages,
} from '../controler/custFoodController.js';
import tokenVeryfiy from '../middleware/tokenVerify.js';

const router = express.Router();

router.post('/api/v1/cust-food', tokenVeryfiy, createMealPackage);

router.get('/api/v1/cust-food', tokenVeryfiy, getAllMealPackages);

export default router;
