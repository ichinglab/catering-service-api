import express from 'express';

import { createBrackfast } from '../controler/brackfastController.js';
import tokenVeryfiy from '../middleware/tokenVerify.js';

const router = express.Router();

router.post('/api/v1/brackfast', tokenVeryfiy, createBrackfast);

export default router;
