import bcrypt from 'bcrypt';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import prisma from '../config/prismaClient.js';
import { isEmail, isMobile } from '../helper/Helper.js';

/**
 * @description  student Register
 * @method POST
 * @route /api/v1/student
 * @access public
 */

export const userRegister = asyncHandler(async (req, res) => {
  const { first_name, last_name, auth, address, password } = req.body;

  if (!first_name || !auth || !password) {
    return res.status(400).json({ message: 'all fields are required' });
  }

  let authEmail = null;
  let authPhone = null;

  if (isEmail(auth)) {
    authEmail = auth;

    const checkEmail = await prisma.user.findFirst({
      where: { email: authEmail },
    });

    if (checkEmail) {
      return res.status(400).json({ message: 'email already exists' });
    }
  } else if (isMobile(auth)) {
    authPhone = auth;

    const checkPhone = await prisma.user.findFirst({
      where: { phone: authPhone },
    });

    if (checkPhone) {
      return res.status(400).json({ message: 'Phone already exists' });
    }
  } else {
    return res.status(400).json({ message: 'Invalid email or phone format' });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      first_name,
      last_name,
      email: authEmail,
      phone: authPhone,
      address,
      password: hashPassword,
    },
  });

  if (user) {
    const activationToken = jwt.sign(
      { auth },
      process.env.ACCOUNT_ACTIVAION_SECRET,
      { expiresIn: '500min' }
    );

    // res.cookie('activationToken', activationToken);

    // if (authEmail) {
    //   await AccountActivationEmail(auth, { code: otp, link: '' });
    // } else if (authPhone) {
    //   await sendSMS(auth, `Hello ${name} your activation OTP is ${otp}`);
    // }
  }

  res.status(201).json({ user, status: true, message: 'Register successful' });
});

/**
 * @description  get all user
 * @method GET
 * @route /api/v1/register
 * @access public
 */
export const getUser = asyncHandler(async (req, res) => {
  const data = await prisma.user.findMany();
  res
    .status(200)
    .json({ users: data, status: true, message: 'all user get success' });
});

/**
 * @description  student Account Activition
 * @method POST
 * @route /api/v1/student
 * @access public
 */

// export const accountActivitonByOtp = asyncHandler(async (req, res) => {
//   //get token
//   const { token } = req.params;
//   const { otp } = req.body;

//   //token dicode
//   const activitionToken = tokenDecode(token);

//   // veryfiy token
//   const tokenVerify = jwt.verify(
//     activitionToken,
//     process.env.ACCOUNT_ACTIVAION_SECRET
//   );

//   //check token
//   if (!tokenVerify) {
//     return res.status(400).json({ message: "Invalid Token" });
//   }

//   //activate Student
//   let activateStudent = null;
//   if (isEmail(tokenVerify.auth)) {
//     activateStudent = await Student.findOne({ email: tokenVerify.auth });
//     if (!activateStudent) {
//       return res.status(400).json({ message: "Student email not found" });
//     }
//   } else if (isMobile(tokenVerify.auth)) {
//     activateStudent = await Student.findOne({ phone: tokenVerify.auth });
//     if (!activateStudent) {
//       return res.status(400).json({ message: "Student phone not found" });
//     }
//   } else {
//     return res.status(400).json({ message: "Invalid Student" });
//   }

//   //check otp
//   if (otp !== activateStudent.accessToken) {
//     return res.status(400).json({ message: "Wrong OTP" });
//   }

//   //update active Student
//   activateStudent.isActive = true;
//   activateStudent.accessToken = null;
//   activateStudent.save();

//   //clear cookie
//   res.clearCookie("activitionToken");

//   //final response
//   res.status(200).json({ message: "Student Activation successfull" });
// });

/**
 * @description  Student Login
 * @method POST
 * @route /api/v1/student/login
 * @access public
 */

// export const loingUser = asyncHandler(async (req, res) => {
//   const { auth, password } = req.body;

//   // input validation
//   if (!auth || !password) {
//     return res
//       .status(400)
//       .json({ status: true, message: 'All fields are required' });
//   }

//   // try to find user
//   let loginUser = null;
//   if (isEmail(auth)) {
//     loginUser = await prisma.user.findFirst({ where: { email: auth } });
//   } else if (isMobile(auth)) {
//     loginUser = await prisma.user.findFirst({ where: { phone: auth } });
//   }

//   // if no user or wrong password → always unauthorized
//   if (!loginUser || !bcrypt.compareSync(password, loginUser.password)) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }

//   // create login token
//   const accessToken = jwt.sign({ auth: auth }, process.env.USER_LOGIN_SECRET, {
//     expiresIn: '7d',
//   });

//   // set cookie
//   res.cookie('accessToken', accessToken, {
//     httpOnly: true,
//     secure: process.env.APP_ENV === 'Development' ? false : true,
//     sameSite: 'strict',
//     path: '/',
//     maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
//   });

//   // success response
//   res.status(200).json({
//     loginUser,
//     status: true,
//     accessToken,
//     message: 'Login successful',
//   });
// });

export const loingUser = asyncHandler(async (req, res) => {
  const { auth, password } = req.body;

  // input validation
  if (!auth || !password) {
    return res
      .status(400)
      .json({ status: false, message: 'All fields are required' });
  }

  // try to find user
  let loginUser = null;
  if (isEmail(auth)) {
    loginUser = await prisma.user.findFirst({ where: { email: auth } });
  } else if (isMobile(auth)) {
    loginUser = await prisma.user.findFirst({ where: { phone: auth } });
  }

  // if no user or wrong password → unauthorized
  if (!loginUser || !bcrypt.compareSync(password, loginUser.password)) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // ✅ create login token with user details
  const accessToken = jwt.sign(
    {
      id: loginUser.id,
      first_name: loginUser.first_name,
      phone: loginUser.phone,
      email: loginUser.email,
      role: loginUser.role,
    },
    process.env.USER_LOGIN_SECRET,
    { expiresIn: '7d' }
  );

  // set cookie
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.APP_ENV === 'Development' ? false : true,
    sameSite: 'strict',
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });

  // success response
  res.status(200).json({
    status: true,
    message: 'Login successful',
    loginUser,
    accessToken,
  });
});

/**
 * @description  Student Logout
 * @method POST
 * @route /api/v1/student/login
 * @access public
 */

export const logOut = asyncHandler(async (req, res) => {
  res.clearCookie('accessToken');
  res.status(200).json({ status: true, message: 'Logut successfull' });
});

/**
 * @description  Logdin student
 * @method POST
 * @route /api/v1/student/logdin
 * @access private
 */

export const loggedinUser = asyncHandler(async (req, res) => {
  if (!req.me) {
    return res.status(400).json({ message: 'Unautorized User' });
  }
  //final response
  res
    .status(200)
    .json({ auth: req.me, status: true, message: 'Loggedin user found' });
});
