import express from 'express';

import {
  createDinner,
  deleteDinner,
  getAllDinners,
  updateDinner,
} from '../controler/dinnerController.js';
import tokenVeryfiy from '../middleware/tokenVerify.js';

const router = express.Router();

router.post('/api/v1/dinner', tokenVeryfiy, createDinner);

router.get('/api/v1/dinners', tokenVeryfiy, getAllDinners);

router.delete('/api/v1/dinner/:id', tokenVeryfiy, deleteDinner);

router.patch('/api/v1/dinner/:id', tokenVeryfiy, updateDinner);

export default router;
