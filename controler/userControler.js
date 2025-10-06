import { PrismaClient } from '@prisma/client';
import asyncHandler from 'express-async-handler';
import { fileUploadToCloud } from '../utils/cloudinary.js';
const prisma = new PrismaClient();
/**
 *
 * @description Get all student
 * @method GET
 * @route api/v1/student
 * @access public
 */
export const getAllUser = asyncHandler(async (req, res) => {
  const data = await prisma.user.findMany({
    orderBy: { updatedAt: 'desc' },
  });
  res.status(200).json({
    users: data,
    message: 'All student get successful',
  });
});

/**
 *
 * @description Single Student
 * @method GET
 * @route api/v1/student
 * @access public
 */

export const getSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const singleData = await prisma.user.findUnique({ where: { id: id } });

  res
    .status(200)
    .json({ singleData, status: true, message: 'get single student' });
});

/**
 *
 * @description Delete Student
 * @method DELETE
 * @route api/v1/student
 * @access public
 */
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const delData = await prisma.user.delete({ where: { id: id } });
  //await fileDataDeleteFromCloud(findPublicId(delData.photo));

  res
    .status(200)
    .json({ delData, status: true, message: 'User delete successfull' });
});

/**
 *
 * @description Update student
 * @method PEATCH
 * @route api/v1/student
 * @access public
 */

export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, dob, gender, role } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ message: 'name, phone  are requried!' });
  }
  //check photo
  let fileData = null;
  if (req.file) {
    const data = await fileUploadToCloud(req.file.path);
    fileData = data.secure_url;
  }

  const updatedUser = await prisma.user.update({
    where: { id: id },
    data: {
      name,
      email,
      phone,
      image: fileData,
      dob,
      gender,
      role,
    },
  });

  res.status(200).json({
    message: 'Update successful',
    user: updatedUser,
  });
});
