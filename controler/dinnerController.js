import prisma from '../config/prismaClient.js';

//create dinner
export const createDinner = async (req, res) => {
  const { title, price } = req.body;
  try {
    const dinner = await prisma.dinner.create({
      data: {
        title,
        price,
      },
    });
    res.status(201).json({
      dinner,
      status: true,
      message: 'dinner created successfully done',
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Failed to create dinner',
      error: error.message,
    });
  }
};

//get all dinners
export const getAllDinners = async (req, res) => {
  try {
    const dinners = await prisma.dinner.findMany({
      orderBy: { updatedAt: 'desc' },
    });
    res.status(200).json({
      dinners,
      status: true,
      message: 'dinners retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Failed to retrieve dinners',
      error: error.message,
    });
  }
};

//delete dinner by id
export const deleteDinner = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.dinner.delete({
      where: { id },
    });
    res.status(200).json({
      status: true,
      message: 'dinner deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Failed to delete dinner',
      error: error.message,
    });
  }
};

//update dinner by id
export const updateDinner = async (req, res) => {
  const { id } = req.params;
  const { title, price } = req.body;
  try {
    const updateddinner = await prisma.dinner.update({
      where: { id },
      data: { title, price },
    });
    res.status(200).json({
      updateddinner,
      status: true,
      message: 'dinner updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Failed to update dinner',
      error: error.message,
    });
  }
};
