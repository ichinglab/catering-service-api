import express from 'express';
import {
  createService,
  deleteService,
  getAllService,
  updateService,
} from '../controler/ourServiceControler.js';
import tokenVeryfiy from '../middleware/tokenVerify.js';

const router = express.Router();

router.post('/api/v1/service', tokenVeryfiy, createService);
router.get('/api/v1/service', getAllService);
router.delete('/api/v1/service/:id', deleteService);
router.put('/api/v1/service/:id', updateService);

export default router;
