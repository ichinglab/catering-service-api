import express from 'express';
import { createMealPackage } from '../controler/custFoodController';
import tokenVeryfiy from '../middleware/tokenVerify.js';

const router = express.Router();

router.post('/api/v1/dinner', tokenVeryfiy, createMealPackage);

export default router;
