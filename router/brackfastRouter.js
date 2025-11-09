import express from 'express';

import {
  createBrackfast,
  deleteBrackfast,
  getAllBrackfasts,
  updateBrackfast,
} from '../controler/brackfastController.js';
import tokenVeryfiy from '../middleware/tokenVerify.js';

const router = express.Router();

router.post('/api/v1/breakfast', tokenVeryfiy, createBrackfast);

router.get('/api/v1/breakfast', getAllBrackfasts);

router.delete('/api/v1/breakfast/:id', tokenVeryfiy, deleteBrackfast);

router.patch('/api/v1/breakfast/:id', tokenVeryfiy, updateBrackfast);

export default router;
