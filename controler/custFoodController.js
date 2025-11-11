import prisma from '../config/prismaClient.js';

/**
 * @desc   Create a new meal package
 * @route  POST /api/v1/meal-package
 * @access Admin
 */
export const createMealPackage = async (req, res) => {
  try {
    const { mealType, userId, packageDuration, items } = req.body;

    // Calculate total price
    const totalPrice = items.reduce(
      (sum, item) => sum + (item.price || 0) * (item.qty || 1),
      0
    );

    const newPackage = await prisma.mealPackage.create({
      data: {
        userId,
        mealType,
        packageDuration,
        items,
        totalPrice,
      },
    });

    res.status(201).json({
      status: true,
      message: 'Meal package created successfully',
      data: newPackage,
    });
  } catch (error) {
    console.error('Error creating meal package:', error);
    res.status(500).json({
      status: false,
      message: 'Server error while creating meal package',
      error: error.message,
    });
  }
};

/**
 * @desc   get all customized food
 * @route  POST /api/v1/meal-package
 * @access  Admin
 */

export const getAllMealPackages = async (req, res) => {
  try {
    const mealPackages = await prisma.mealPackage.findMany();
    res.status(200).json({
      status: true,
      message: 'Meal packages retrieved successfully',
      data: mealPackages,
    });
  } catch (error) {
    console.error('Error retrieving meal packages:', error);
    res.status(500).json({
      status: false,
      message: 'Server error while retrieving meal packages',
      error: error.message,
    });
  }
};

export const getCustomizedFoodByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const mealPackage = await prisma.mealPackage.findMany({
      where: { userId: id },
    });
    res.status(200).json({
      status: true,
      message: 'Meal package retrieved successfully',
      data: mealPackage,
    });
  } catch (error) {
    console.error('Error retrieving meal package:', error);
    res.status(500).json({
      status: false,
      message: 'Server error while retrieving meal package',
      error: error.message,
    });
  }
};

/**
 * @desc   Update by id
 * @route  POST /api/v1/meal-package
 * @access  Admin
 */

export const updateMealPackage = async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_status } = req.body;

    const updatedPackage = await prisma.mealPackage.update({
      where: { id },
      data: {
        payment_status,
      },
    });

    res.status(200).json({
      status: true,
      message: 'Meal package updated successfully',
      data: updatedPackage,
    });
  } catch (error) {
    console.error('Error updating meal package:', error);
    res.status(500).json({
      status: false,
      message: 'Server error while updating meal package',
      error: error.message,
    });
  }
};
