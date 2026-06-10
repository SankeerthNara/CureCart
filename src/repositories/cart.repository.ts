import { prisma } from '../config/db';

export class CartRepository {
  /**
   * Fetch the active cart for a user including the medicine details
   */
  static async getCartByUserId(userId: string) {
    let cart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            medicine: true,
          },
        },
      },
    });

    // If no cart exists, create an empty one
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              medicine: true,
            },
          },
        },
      });
    }

    return cart;
  }

  /**
   * Add or update an item in the user's cart
   */
  static async upsertCartItem(cartId: string, medicineId: string, quantity: number) {
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_medicineId: {
          cartId,
          medicineId,
        },
      },
    });

    if (existingItem) {
      return prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    }

    return prisma.cartItem.create({
      data: {
        cartId,
        medicineId,
        quantity,
      },
    });
  }

  /**
   * Remove an item entirely from the cart
   */
  static async removeCartItem(cartId: string, medicineId: string) {
    return prisma.cartItem.deleteMany({
      where: {
        cartId,
        medicineId,
      },
    });
  }

  /**
   * Clears all items in a cart (used after successful checkout)
   */
  static async clearCartItems(cartId: string) {
    return prisma.cartItem.deleteMany({
      where: { cartId },
    });
  }
}
