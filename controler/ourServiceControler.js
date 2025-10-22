import prisma from '../config/prismaClient.js';
/**
 * @description  Service create
 * @method POST
 * @route /api/v1/service
 * @access public
 */
export const createService = async (req, res) => {
  const { title, photo } = req.body;
  try {
    //find user role
    const user = await prisma.user.findUnique({
      where: { id: req.me.id },
      select: { role: true },
    });
    if (user.role !== 'ADMIN') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const service = await prisma.service.create({
      data: {
        title,
        photo,
      },
    });
    res.status(201).json({
      service,
      status: true,
      message: 'subject created successfully done',
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Failed to create subject',
      error: error.message,
    });
  }
};

/**
 * @description  get all Service
 * @method POST
 * @route /api/v1/service
 * @access public
 */

export const getAllService = async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { updatedAt: 'desc' },
    });
    res.status(200).json({
      services,
      status: true,
      message: 'Services retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Failed to retrieve services',
      error: error.message,
    });
  }
};

/**
 * @description  Delete Service
 * @method DELETE
 * @route /api/v1/service/:id
 * @access public
 */
export const deleteService = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.service.delete({
      where: { id },
    });
    res.status(200).json({
      status: true,
      message: 'Service deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Failed to delete service',
      error: error.message,
    });
  }
};
/**
 * @description  Update Service
 * @method PUT
 * @route /api/v1/service/:id
 * @access public
 */
export const updateService = async (req, res) => {
  const { id } = req.params;
  const { title, photo } = req.body;
  try {
    const updatedService = await prisma.service.update({
      where: { id },
      data: { title, photo },
    });
    res.status(200).json({
      updatedService,
      status: true,
      message: 'Service updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Failed to update service',
      error: error.message,
    });
  }
};
