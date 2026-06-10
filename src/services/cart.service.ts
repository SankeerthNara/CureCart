import { CartRepository } from '../repositories/cart.repository';
import { MedicineRepository } from '../repositories/medicine.repository';

export class CartService {
  static async getCart(userId: string) {
    return CartRepository.getCartByUserId(userId);
  }

  static async addToCart(userId: string, medicineId: string, quantity: number = 1) {
    if (quantity <= 0) throw new Error("Quantity must be greater than zero");

    // Business Logic: Verify medicine exists and has stock
    const medicine = await MedicineRepository.getMedicineById(medicineId);
    if (!medicine) {
      throw new Error("Medicine not found");
    }

    if (medicine.stock < quantity) {
      throw new Error("Not enough stock available for this medicine");
    }

    const cart = await this.getCart(userId);
    return CartRepository.upsertCartItem(cart.id, medicineId, quantity);
  }

  static async removeFromCart(userId: string, medicineId: string) {
    const cart = await this.getCart(userId);
    return CartRepository.removeCartItem(cart.id, medicineId);
  }
}
