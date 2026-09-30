import { Xendit } from 'xendit-node';

export const xendit = new Xendit({ secretKey: process.env.XENDIT_SECRET_KEY || '' });

// Metode di halaman payment -> payment_methods di invoice Xendit
export const XENDIT_METHODS = {
  QRIS: ['QRIS'],
  CARD: ['CREDIT_CARD'],
  OTHER: ['OVO', 'DANA', 'SHOPEEPAY', 'LINKAJA', 'BCA', 'BNI', 'BRI', 'MANDIRI', 'PERMATA'],
};
