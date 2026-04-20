/**
 * Kategori Modeli (models/Category.ts)
 * 
 * Filmlerin hangi türde (Aksiyon, Dram, Komedi vb.) olduğunu 
 * gruplandırmak için kullanılan veritabanı şemasıdır.
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string; // Kategori adı (Örn: Korku, Bilim Kurgu)
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
});

// Eğer model zaten tanımlanmışsa onu kullan, tanımlanmamışsa yeni oluştur
export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
