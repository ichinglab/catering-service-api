import { PrismaClient } from '@prisma/client';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { isEmail, isMobile } from '../helper/Helper.js';

// Create Prisma instance once (outside the middleware)
const prisma = new PrismaClient();

const tokenVerify = asyncHandler(async (req, res, next) => {
  let accessToken = req.cookies?.accessToken;

  if (!accessToken && req.headers?.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith('Bearer ')) {
      accessToken = authHeader.slice(7);
    }
  }

  if (!accessToken) {
    return res.status(401).json({ message: 'Unauthorized: Token missing' });
  }

  try {
    const decode = jwt.verify(accessToken, process.env.USER_LOGIN_SECRET);

    if (!decode?.auth) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    let whereClause;
    if (isEmail(decode.auth)) {
      whereClause = { email: decode.auth };
    } else if (isMobile(decode.auth)) {
      whereClause = { phone: decode.auth };
    } else {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const me = await prisma.user.findUnique({
      where: whereClause,
      select: { id: true, first_name: true, email: true, phone: true },
    });

    if (!me) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    req.me = me;
    next();
  } catch (error) {
    console.error('Token verification error:', error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }

    return res.status(500).json({ message: 'Server error' });
  }
});

export default tokenVerify;
