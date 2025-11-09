import express from 'express';

import {
  createBrackfast,
  deleteBrackfast,
  getAllBrackfasts,
  updateBrackfast,
} from '../controler/brackfastController.js';
import tokenVeryfiy from '../middleware/tokenVerify.js';

const router = express.Router();

router.post('/api/v1/brackfast', tokenVeryfiy, createBrackfast);

router.get('/api/v1/brackfast', tokenVeryfiy, getAllBrackfasts);

router.delete('/api/v1/brackfast/:id', tokenVeryfiy, deleteBrackfast);

router.patch('/api/v1/brackfast/:id', tokenVeryfiy, updateBrackfast);

export default router;
