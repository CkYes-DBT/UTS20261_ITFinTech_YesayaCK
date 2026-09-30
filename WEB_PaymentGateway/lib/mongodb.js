import mongoose from 'mongoose';

let cached = global.mongoose || (global.mongoose = { conn: null, promise: null });

export default async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI belum diisi di .env.local');
  cached.promise = cached.promise || mongoose.connect(process.env.MONGODB_URI);
  cached.conn = await cached.promise;
  return cached.conn;
}
