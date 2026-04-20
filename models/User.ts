/**
 * Kullanıcı Modeli (models/User.ts)
 * 
 * Sistemdeki üyelerin bilgilerini saklayan şemadır.
 * Şifreler veritabanına kaydedilmeden önce mutlaka hash'lenmelidir (güvenlik için).
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user'; // Kullanıcı yetki seviyesi
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
}, { timestamps: true }); // Kayıt ve güncelleme tarihlerini otomatik tutar

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
