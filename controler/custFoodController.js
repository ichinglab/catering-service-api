import prisma from '../config/prismaClient.js';

/**
 * @desc   Create a new meal package
 * @route  POST /api/v1/meal-package
 * @access Public or Admin
 */
export const createMealPackage = async (req, res) => {
  try {
    const { mealType, packageDuration, items } = req.body;

    if (!mealType || !packageDuration || !items?.length) {
      return res.status(400).json({
        status: false,
        message: 'mealType, packageDuration, and items are required',
      });
    }

    // Calculate total price
    const totalPrice = items.reduce(
      (sum, item) => sum + (item.price || 0) * (item.qty || 1),
      0
    );

    const newPackage = await prisma.mealPackage.create({
      data: {
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
