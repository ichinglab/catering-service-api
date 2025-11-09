import prisma from '../config/prismaClient.js';

//create lunch
export const createLunch = async (req, res) => {
  const { title, price } = req.body;
  try {
    const lunch = await prisma.lunch.create({
      data: {
        title,
        price,
      },
    });
    res.status(201).json({
      lunch,
      status: true,
      message: 'lunch created successfully done',
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Failed to create lunch',
      error: error.message,
    });
  }
};

//get all lunchs
export const getAllLunchs = async (req, res) => {
  try {
    const lunchs = await prisma.lunch.findMany({
      orderBy: { updatedAt: 'desc' },
    });
    res.status(200).json({
      lunchs,
      status: true,
      message: 'lunchs retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Failed to retrieve lunchs',
      error: error.message,
    });
  }
};

//delete lunch by id
export const deleteLunch = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.lunch.delete({
      where: { id },
    });
    res.status(200).json({
      status: true,
      message: 'lunch deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Failed to delete lunch',
      error: error.message,
    });
  }
};

//update lunch by id
export const updateLunch = async (req, res) => {
  const { id } = req.params;
  const { title, price } = req.body;
  try {
    const updatedlunch = await prisma.lunch.update({
      where: { id },
      data: { title, price },
    });
    res.status(200).json({
      updatedlunch,
      status: true,
      message: 'lunch updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Failed to update lunch',
      error: error.message,
    });
  }
};
