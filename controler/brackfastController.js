import prisma from '../config/prismaClient.js';

//create brackfast
export const createBrackfast = async (req, res) => {
  const { title, price } = req.body;
  try {
    const brackfast = await prisma.breackfast.create({
      data: {
        title,
        price,
      },
    });
    res.status(201).json({
      brackfast,
      status: true,
      message: 'brackfast created successfully done',
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Failed to create brackfast',
      error: error.message,
    });
  }
};
