/**
 * Veritabanı Bağlantı Dosyası (lib/db.ts)
 * 
 * Bu dosya, MongoDB veritabanına güvenli bir şekilde bağlanmamızı sağlar.
 * Mongoose kütüphanesini kullanarak bağlantı durumunu takip eder ve 
 * gereksiz bağlantı türlerini önlemek için önbelleğe alma (caching) uygular.
 */

import mongoose from 'mongoose';

// MongoDB bağlantı adresi (Çevresel değişkenlerden alınır)
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Lütfen .env.local dosyasına MONGODB_URI ekleyin.');
}

/**
 * Bağlantı nesnesini global olarak saklayarak 
 * sunucusuz (serverless) ortamlarda performans artışı sağlıyoruz.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // Eğer zaten bir bağlantı varsa onu döndür
  if (cached.conn) {
    return cached.conn;
  }

  // Yeni bir bağlantı oluşturuluyorsa söz (promise) oluştur
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log(' MongoDB bağlantısı başarılı.');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error(' MongoDB bağlantı hatası:', e);
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
