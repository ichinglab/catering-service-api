import { PrismaClient } from '@prisma/client';
//prisma inti
const prisma = new PrismaClient();

/**
 * @description  Ceteate Product
 * @method POST
 * @route /api/v1/product
 * @access public
 */
export const productCreate = async (req, res) => {
  const {
    product_name,
    base_price,
    total_price,
    quantity,
    product_photo,
    categoryIds,
  } = req.body;

  try {
    const product = await prisma.product.create({
      data: {
        product_name,
        base_price,
        total_price,
        quantity,
        product_photo,
        categories: {
          create: categoryIds.map(categoryId => ({
            category: { connect: { id: categoryId } },
          })),
        },
      },
      include: {
        categories: { include: { category: true } },
      },
    });

    res
      .status(201)
      .json({ product, status: true, message: 'Product created successfully' });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: 'Product creation failed',
      error: error.message,
    });
  }
};

/**
 * @description   get all Products
 * @method GET
 * @route /api/v1/product
 * @access public
 */
export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        categories: { include: { category: true } },
      },
    });

    res.status(200).json({
      products,
      status: true,
      message: 'All Products get successfull',
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: 'getting all Products failed',
      error: error.message,
    });
  }
};

/**
 * @description   get single Product
 * @method GET
 * @route /api/v1/product
 * @access public
 */
export const getSingleProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    });
    res.status(200).json({
      product,
      status: true,
      message: 'Single Product get successfull',
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: 'getting single Product failed',
      error: error.message,
    });
  }
};

/**
 * @description   Delete Product
 * @method DELETE
 * @route /api/v1/product
 * @access public
 */
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    // Step 1: Delete relations first
    await prisma.categoryProduct.deleteMany({
      where: { productId: id },
    });

    // Step 2: Delete the product itself
    const product = await prisma.product.delete({
      where: { id },
    });

    res.status(200).json({
      product,
      status: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: 'Product delete failed',
      error: error.message,
    });
  }
};

/**
 * @description   Update Product
 * @method PATCH
 * @route /api/v1/product
 * @access public
 */
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const {
    product_name,
    base_price,
    total_price,
    quantity,
    product_photo,
    categoryIds, // ✅ You must include this
  } = req.body;

  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        product_name,
        base_price,
        total_price,
        quantity,
        product_photo,

        // ✅ If categoryIds is provided, update relations
        ...(categoryIds && {
          categories: {
            deleteMany: {}, // Remove old category relations
            create: categoryIds.map(categoryId => ({
              category: { connect: { id: categoryId } },
            })),
          },
        }),
      },
      include: {
        categories: {
          include: { category: true },
        },
      },
    });

    res.status(200).json({
      product,
      status: true,
      message: 'Product updated successfully',
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        status: false,
        message: 'Product not found',
      });
    }

    res.status(400).json({
      status: false,
      message: 'Product update failed',
      error: error.message,
    });
  }
};
