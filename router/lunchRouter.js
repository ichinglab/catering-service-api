import express from 'express';

import tokenVeryfiy from '../middleware/tokenVerify.js';
import {
  createLunch,
  deleteLunch,
  getAllLunchs,
  updateLunch,
} from '../controler/lunchController.js';

const router = express.Router();

router.post('/api/v1/lunch', tokenVeryfiy, createLunch);

router.get('/api/v1/lunch', tokenVeryfiy, getAllLunchs);

router.delete('/api/v1/lunch/:id', tokenVeryfiy, deleteLunch);

router.patch('/api/v1/lunch/:id', tokenVeryfiy, updateLunch);

export default router;
