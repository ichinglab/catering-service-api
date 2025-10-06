import { PrismaClient } from '@prisma/client';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { isEmail, isMobile } from '../helper/Helper.js';

const prisma = new PrismaClient();

const tokenVerify = asyncHandler(async (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decode = jwt.verify(accessToken, process.env.USER_LOGIN_SECRET);

    let me = null;
    if (isEmail(decode?.auth)) {
      me = await prisma.user.findUnique({
        where: { email: decode?.auth },
        select: { id: true, name: true, email: true, phone: true },
      });
    } else if (isMobile(decode?.auth)) {
      me = await prisma.user.findUnique({
        where: { phone: decode.auth },
        select: { id: true, name: true, email: true, phone: true },
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
    return res.status(401).json({ message: 'Invalid token' });
  }
});

export default tokenVerify;
