import prisma from '../config/prismaClient.js';
/**
 * @description  Category create
 * @method POST
 * @route /api/v1/category
 * @access public
 */
export const createCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const category = await prisma.category.create({
      data: {
        name,
      },
    });
    res.status(201).json({
      category,
      status: true,
      message: 'Category created successfully done',
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Failed to create Category',
      error: error.message,
    });
  }
};

/**
 * @description  Get all Category
 * @method GET
 * @route /api/v1/category
 * @access public
 */
export const getAllCategory = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { updatedAt: 'desc' },
    });
    res.status(200).json({
      categories,
      status: true,
      message: 'Categories retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Failed to retrieve categories',
      error: error.message,
    });
  }
};

/**
 * @description  Delete category
 * @method DELETE
 * @route /api/v1/category/:id
 * @access public
 */
export const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.category.delete({
      where: { id },
    });
    res.status(200).json({
      status: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Failed to delete Category',
      error: error.message,
    });
  }
};

/**
 * @description  Update Category
 * @method PUT
 * @route /api/v1/sujbect/:id
 * @access public
 */
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const updatedCategory = await prisma.Category.update({
      where: { id },
      data: { name },
    });
    res.status(200).json({
      updatedCategory,
      status: true,
      message: 'Category updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Failed to update Category',
      error: error.message,
    });
  }
};
