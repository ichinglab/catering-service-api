import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * @description  Oreder create
 * @method POST
 * @route /api/v1/order
 * @access private
 */
export const createOrder = async (req, res) => {
  try {
    const userId = req.me.id; // logged-in user ID
    const { productIds, quantity, order_status } = req.body;
    const newOrder = await prisma.order.create({
      data: {
        userId,
        quantity,
        order_status,
        products: {
          connect: productIds.map(id => ({ id })), // connect existing products
        },
      },
      include: {
        products: true,
      },
    });

    res.status(201).json({
      status: true,
      message: 'Order created successfully',
      data: newOrder,
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      status: false,
      message: 'Failed to create order',
      error: error.message,
    });
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
  const { id } = req.params;
  try {
    if (!req.me) {
      return res.status(401).json({
        status: false,
        message: 'Unauthorized',
      });
    }
    await prisma.order.delete({
      where: { id },
    });
    res.status(200).json({
      status: true,
      message: 'Order deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
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
export const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { order_status } = req.body;
  try {
    if (!req.me) {
      return res.status(401).json({
        status: false,
        message: 'Unauthorized',
      });
    }
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { order_status },
    });
    res.status(200).json({
      updatedOrder,
      status: true,
      message: 'Order updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Failed to update order',
      error: error.message,
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
