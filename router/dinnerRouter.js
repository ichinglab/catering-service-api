import express from 'express';

import tokenVeryfiy from '../middleware/tokenVerify.js';

const router = express.Router();

router.post('/api/v1/dinner', tokenVeryfiy, createLunch);

router.get('/api/v1/dinner', tokenVeryfiy, getAllLunchs);

router.delete('/api/v1/dinner/:id', tokenVeryfiy, deleteLunch);

router.patch('/api/v1/dinner/:id', tokenVeryfiy, updateLunch);

export default router;
