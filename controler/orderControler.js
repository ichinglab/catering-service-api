import prisma from '../config/prismaClient.js';

/**
 * @description  Oreder create
 * @method POST
 * @route /api/v1/order
 * @access private
 */

export const createOrder = async (req, res) => {
  try {
    const { products } = req.body;
    const id = req.me.id;
    if (!req.me) {
      return res.status(401).json({
        status: false,
        message: 'Unauthorized',
      });
    }

    if (!products || products.length === 0) {
      return res
        .status(400)
        .json({ status: false, message: 'Select products' });
    }

    // Step 1: Fetch all product details
    const productIds = products.map(p => p.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (dbProducts.length !== productIds.length) {
      return res
        .status(404)
        .json({ status: false, message: 'Invalid products' });
    }

    // Step 2: Calculate totals
    let subtotal = 0;
    const orderItemsData = products.map(p => {
      const dbProd = dbProducts.find(prod => prod.id === p.productId);
      const price = dbProd.total_price;
      const itemSubtotal = price * p.quantity;
      subtotal += itemSubtotal;

      return {
        productId: p.productId,
        quantity: p.quantity,
        price,
        subtotal: itemSubtotal,
      };
    });

    const shipping_fee = 0;
    const total_amount = subtotal + shipping_fee;

    // Step 3: Create the order
    const order = await prisma.order.create({
      data: {
        userId: id,
        subtotal,
        shipping_fee,
        total_amount,
        orderItems: {
          create: orderItemsData,
        },
      },
      include: {
        orderItems: {
          include: { product: true },
        },
        user: true,
      },
    });

    //Step 4: Update product sold count
    await Promise.all(
      products.map(async p => {
        await prisma.product.update({
          where: { id: p.productId },
          data: {
            sold_count: {
              increment: p.quantity,
            },
          },
        });
      })
    );

    res.status(201).json({
      status: true,
      message: 'Order created successfully',
      data: order,
    });
  } catch (error) {
    console.error('Order create error:', error);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};

/**
 * @description  Get all orders
 * @method GET
 * @route /api/v1/order
 * @access private
 */
export const getAllOrders = async (req, res) => {
  try {
    if (!req.me) {
      return res.status(401).json({
        status: false,
        message: 'Unauthorized',
      });
    }
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            email: true,
            phone: true,
          },
        },
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc', // latest first
      },
    });

    res.status(200).json({
      status: true,
      message: 'All orders fetched successfully',
      data: orders,
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      status: false,
      message: 'Failed to fetch orders',
      error: error.message,
    });
  }
};

/**
 * @description  Delete orders
 * @method DELETE
 * @route /api/v1/order/:id
 * @access private
 */
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.me) {
      return res.status(401).json({
        status: false,
        message: 'Unauthorized',
      });
    }

    const existingOrder = await prisma.order.findFirst({
      where: { id: id },
      include: { orderItems: true },
    });

    if (!existingOrder) {
      return res.status(404).json({
        status: false,
        message: 'Order not found',
      });
    }

    // First delete child order items
    await prisma.OrderProduct.deleteMany({
      where: { orderId: id },
    });

    // Then delete parent order
    await prisma.order.delete({
      where: { id: id },
    });

    return res.status(200).json({
      status: true,
      message: `Order #${id} deleted successfully`,
    });
  } catch (error) {
    console.error('Delete order error:', error);
    return res.status(500).json({
      status: false,
      message: 'Failed to delete order',
      error: error.message,
    });
  }
};

/**
 * @description  Update order
 * @method PUT
 * @route /api/v1/order/:id
 * @access private
 */
// export const updateOrder = async (req, res) => {
//   const { id } = req.params;
//   const { order_status } = req.body;
//   try {
//     if (!req.me) {
//       return res.status(401).json({
//         status: false,
//         message: 'Unauthorized',
//       });
//     }
//     const updatedOrder = await prisma.order.update({
//       where: { id },
//       data: { order_status },
//     });
//     res.status(200).json({
//       updatedOrder,
//       status: true,
//       message: 'Order updated successfully',
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: 'Failed to update order',
//       error: error.message,
//     });
//   }
// };

export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params; // order id from route parameter
    const { order_status, payment_status, payment_method, shipping_fee } =
      req.body;

    // Step 1: Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id: id },
      include: { orderItems: true },
    });

    if (!existingOrder) {
      return res.status(404).json({
        status: false,
        message: 'Order not found',
      });
    }

    // Step 2: Update order fields
    const updatedOrder = await prisma.order.update({
      where: { id: id },
      data: {
        order_status: order_status || existingOrder.order_status,
        payment_status: payment_status || existingOrder.payment_status,
        payment_method: payment_method || existingOrder.payment_method,
        shipping_fee:
          typeof shipping_fee === 'number'
            ? shipping_fee
            : existingOrder.shipping_fee,
      },
      include: {
        user: true,
        orderItems: {
          include: { product: true },
        },
      },
    });

    return res.status(200).json({
      status: true,
      message: 'Order updated successfully',
      data: updatedOrder,
    });
  } catch (error) {
    console.error('Order update error:', error);
    return res.status(500).json({
      status: false,
      message: 'Server error',
    });
  }
};

/**
 * @description  Get order by id
 * @method GET
 * @route /api/v1/order/:id
 * @access private
 */
export const getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!req.me) {
      return res.status(401).json({
        status: false,
        message: 'Unauthorized',
      });
    }
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        products: {
          select: {
            id: true,
            product_name: true,
            base_price: true,
          },
        },
      },
    });
    res.status(200).json({
      status: true,
      message: 'Order fetched successfully',
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Failed to fetch order',
      error: error.message,
    });
  }
};
