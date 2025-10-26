import express from 'express';
import {
  getSingleUser,
  getUser,
  loggedinUser,
  logOut,
  loingUser,
  updateUser,
  userRegister,
} from '../controler/userAuth.js';
import tokenVeryfiy from '../middleware/tokenVerify.js';

//init Router
const router = express.Router();
router.post('/api/v1/register', userRegister);
router.get('/api/v1/users', getUser);
// router.post("/api/v1/activate/:token", accountActivitonByOtp);
router.post('/api/v1/login', loingUser);
router.post('/api/v1/logout', logOut);
router.get('/api/v1/loggedin', tokenVeryfiy, loggedinUser);
router.patch('/api/v1/profile-upate', updateUser);
router.get('/api/v1/user/:id', getSingleUser);

//export default
export default router;
