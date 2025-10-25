import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken'; // install with: npm install validator
import prisma from '../config/prismaClient.js';
import { isEmail } from '../helper/Helper.js';

const tokenVerify = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const accessToken = authHeader.split(' ')[1];

  try {
    // ✅ Decode token synchronously
    const decoded = jwt.verify(accessToken, process.env.USER_LOGIN_SECRET);
    let me = null;
    if (isEmail(decoded.email)) {
      me = await prisma.user.findUnique({
        where: { email: decoded.email },
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          phone: true,
        },
      });
    } else {
      return res.status(400).json({ message: 'Invalid auth data' });
    }

    if (!me) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.me = me;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
});

export default tokenVerify;
