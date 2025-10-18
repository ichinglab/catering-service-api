import { PrismaClient } from '@prisma/client';
//prisma inti
const prisma = new PrismaClient();

/**
 * @description  Ceteate Product
 * @method POST
 * @route /api/v1/product
 * @access public
 */
export const createProduct = async (req, res) => {
  const {
    sku,
    title,
    description,
    base_price,
    total_price,
    discount,
    quantity,
    address,
    duration,
    product_photo,
    timeSlots,
    categoryIds,
  } = req.body;

  try {
    const product = await prisma.product.create({
      data: {
        sku,
        title,
        description,
        base_price,
        total_price,
        discount,
        quantity,
        address,
        duration,
        product_photo,
        timeSlots,
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

// export const createProduct = async (req, res) => {
//   const {
//     title,
//     description,
//     price,
//     discount,
//     sku,
//     photo,
//     address,
//     duration,
//     timeSlots,
//     categoryIds,
//   } = req.body;

//   // Calculate total price
//   const total_price = price - (price * discount) / 100;

//   const product = await prisma.product.create({
//     data: {
//       sku,
//       title,
//       description,
//       base_price: price,
//       discount,
//       total_price,
//       product_photo: photo,
//       address,
//       duration,
//       timeSlots,
//       categories: {
//         create: categoryIds.map(categoryId => ({
//           category: { connect: { id: categoryId } },
//         })),
//       },
//     },
//     include: {
//       categories: { include: { category: true } },
//     },
//   });

//   res.status(201).json({
//     success: true,
//     message: 'Product created successfully',
//     data: product,
//   });
// };

export default createProduct;
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
    sku,
    title,
    description,
    base_price,
    total_price,
    discount,
    quantity,
    address,
    duration,
    product_photo,
    timeSlots,
    categoryIds,
  } = req.body;

  try {
    // Build update data object with only provided fields
    const updateData = {};

    if (sku !== undefined) updateData.sku = sku;
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (base_price !== undefined) updateData.base_price = base_price;
    if (total_price !== undefined) updateData.total_price = total_price;
    if (discount !== undefined) updateData.discount = discount;
    if (quantity !== undefined) updateData.quantity = quantity;
    if (address !== undefined) updateData.address = address;
    if (duration !== undefined) updateData.duration = duration;
    if (product_photo !== undefined) updateData.product_photo = product_photo;
    if (timeSlots !== undefined) updateData.timeSlots = timeSlots;

    // Handle category updates: delete old ones and create new ones
    if (categoryIds !== undefined) {
      updateData.categories = {
        deleteMany: {}, // Remove all existing category associations
        create: categoryIds.map(categoryId => ({
          category: { connect: { id: categoryId } },
        })),
      };
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        categories: { include: { category: true } },
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
