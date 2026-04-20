/**
 * Film Modeli (models/Movie.ts)
 * 
 * Uygulama içerisindeki film ve dizi içeriklerini temsil eder.
 * Başlık, açıklama, video linki, izlenme sayısı ve kategori 
 * bilgilerini içerir.
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface IMovie extends Document {
  title: string;
  description: string;
  videoUrl: string; // Video oynatıcı (iframe) için kaynak linki
  thumbnailUrl: string; // Film afişi resmi
  categories: mongoose.Types.ObjectId[]; // Kategori modeline referans
  viewCount: number; // Video izlenme sayısı
}

const MovieSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  videoUrl: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  viewCount: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Movie || mongoose.model<IMovie>('Movie', MovieSchema);
