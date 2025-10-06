import express from 'express';
import {
  deleteUser,
  getAllUser,
  getSingleUser,
  updateUser,
} from '../controler/userControler.js';
import { userMulter } from '../utils/multer.js';

//init router
const router = express.Router();
//all student routers
router.get('/api/v1/user', getAllUser);
router.get('/api/v1/user/:id', getSingleUser);
router.delete('/api/v1/user/:id', deleteUser);
router.patch('/api/v1/user/:id', userMulter, updateUser);

export default router;
