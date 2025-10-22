import asyncHandler from 'express-async-handler';
import prisma from '../config/prismaClient.js';
import { fileUploadToCloud } from '../utils/cloudinary.js';

/**
 *
 * @description Get all user
 * @method GET
 * @route api/v1/user
 * @access public
 */

export const getAllUser = asyncHandler(async (req, res) => {
  const data = await prisma.user.findMany({
    orderBy: { updatedAt: 'desc' },
  });
  res.status(200).json({
    users: data,
    message: 'All user get successful',
  });
});

/**
 *
 * @description Single user
 * @method GET
 * @route api/v1/user
 * @access public
 */

export const getSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const singleData = await prisma.user.findUnique({ where: { id: id } });

  res
    .status(200)
    .json({ singleData, status: true, message: 'get single user' });
});

/**
 *
 * @description Delete user
 * @method DELETE
 * @route api/v1/user
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
 * @description Update user
 * @method PEATCH
 * @route api/v1/user
 * @access public
 */

export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, phone, dob, gender, address, role } = req.body;

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
      first_name,
      last_name,
      phone,
      dob,
      gender,
      address,
      role,
      photo: fileData,
    },
  });

  res.status(200).json({
    message: 'Update successful',
    user: updatedUser,
  });
});
