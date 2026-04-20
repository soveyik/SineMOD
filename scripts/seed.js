/**
 * Veritabanı Besleme Betiği (scripts/seed.js)
 * 
 * Bu dosya, uygulamanın boş görünmemesi için veritabanına 
 * başlangıç verilerini (kategoriler ve örnek filmler) ekler.
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// .env.local dosyasındaki değişkenleri yükle
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Hata: MONGODB_URI bulunamadı. Lütfen .env.local dosyasını kontrol edin.');
    process.exit(1);
}

// Modelleri require ile al (CommonJS formatında)
const CategorySchema = new mongoose.Schema({ name: { type: String, unique: true } });
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

const MovieSchema = new mongoose.Schema({
    title: String,
    description: String,
    videoUrl: String,
    thumbnailUrl: String,
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    viewCount: { type: Number, default: 0 }
});
const Movie = mongoose.models.Movie || mongoose.model('Movie', MovieSchema);

// Kullanıcı Modeli (Giriş için gerekli)
const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: { type: String },
    role: { type: String, default: 'user' }
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);

const bcrypt = require('bcryptjs');

async function seed() {
    try {
        console.log('🚀 Veritabanına bağlanılıyor...');
        await mongoose.connect(MONGODB_URI);

        // 1. Mevcut verileri temizle (Güvenli başlangıç için)
        await Category.deleteMany({});
        await Movie.deleteMany({});
        await User.deleteMany({});

        console.log('👤 Admin kullanıcısı oluşturuluyor...');
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.create({
            name: 'Admin SineMOD',
            email: 'admin@sinemod.com',
            password: hashedPassword,
            role: 'admin'
        });

        console.log('📦 Kategoriler ekleniyor...');
        const categories = await Category.insertMany([
            { name: 'Aksiyon' },
            { name: 'Dram' },
            { name: 'Bilim Kurgu' },
            { name: 'Komedi' },
            { name: 'Macera' },
            { name: 'Animasyon' },
            { name: 'Korku' }
        ]);

        console.log('🎬 Filmler ekleniyor...');
        await Movie.insertMany([
            {
                title: 'Interstellar',
                description: 'Bir grup astronot, insanlığın hayatta kalmasını sağlamak için bir solucan deliğinden geçerek yeni bir yuva arayışına çıkar.',
                videoUrl: 'https://www.youtube.com/embed/zSWdZVtXT7E',
                thumbnailUrl: 'https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&q=80&w=300&h=450',
                categories: [categories[2]._id], // Bilim Kurgu
                viewCount: 1250
            },
            {
                title: 'The Dark Knight',
                description: 'Batman, Gotham City\'yi kaosa sürükleyen Joker ile amansız bir mücadeleye girer.',
                videoUrl: 'https://www.youtube.com/embed/EXeTwQWrcwY',
                thumbnailUrl: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=300&h=450',
                categories: [categories[0]._id, categories[1]._id], // Aksiyon & Dram
                viewCount: 2500
            },
            {
                title: 'Inception',
                description: 'Hırsız Cobb, insanların rüyalarına girerek bilinçaltındaki sırları çalmaktadır.',
                videoUrl: 'https://www.youtube.com/embed/YoHD9XEInc0',
                thumbnailUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=300&h=450',
                categories: [categories[2]._id], // Bilim Kurgu
                viewCount: 1800
            },
            {
                title: 'Avatar: The Way of Water',
                description: 'Jake Sully ve Neytiri, ailelerini korumak için Pandora\'nın su dünyasını keşfederler.',
                videoUrl: 'https://www.youtube.com/embed/d9MyW72ELq0',
                thumbnailUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80&w=300&h=450',
                categories: [categories[0]._id, categories[4]._id], // Aksiyon & Macera
                viewCount: 3200
            },
            {
                title: 'Spider-Man: Into the Spider-Verse',
                description: 'Miles Morales, paralel evrenlerden gelen diğer Örümcek Adamlarla dünyayı kurtarmak için birleşir.',
                videoUrl: 'https://www.youtube.com/embed/g4Hbz2jLxzk',
                thumbnailUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&q=80&w=300&h=450',
                categories: [categories[5]._id, categories[0]._id], // Animasyon & Aksiyon
                viewCount: 4500
            },
            {
                title: 'The Godfather',
                description: 'Bir mafya ailesinin nesiller boyu süren güç mücadelesi ve dönüşümü.',
                videoUrl: 'https://www.youtube.com/embed/sY1S34973zA',
                thumbnailUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=300&h=450',
                categories: [categories[1]._id], // Dram
                viewCount: 900
            },
            {
                title: 'The Last of Us (TV Series)',
                description: 'Modern medeniyetin yok edilmesinden sonra Joel ve Ellie\'nin hayatta kalma hikayesi.',
                videoUrl: 'https://www.youtube.com/embed/uLtkt8BonwM',
                thumbnailUrl: 'https://images.unsplash.com/photo-1621944190310-e3cca1564bd7?auto=format&fit=crop&q=80&w=300&h=450',
                categories: [categories[1]._id, categories[4]._id], // Dram & Macera
                viewCount: 15400
            },
            {
                title: 'Joker',
                description: 'Arthur Fleck\'in toplum dışına itilerek Joker karakterine dönüşümünün karanlık hikayesi.',
                videoUrl: 'https://www.youtube.com/embed/zAGVQLHvwOY',
                thumbnailUrl: 'https://images.unsplash.com/photo-1559548331-f9cb98001426?auto=format&fit=crop&q=80&w=300&h=450',
                categories: [categories[1]._id], // Dram
                viewCount: 5600
            },
            {
                title: 'Spirited Away',
                description: 'Genç Chihiro, ruhların dünyasında mahsur kalır ve ailesini kurtarmaya çalışır.',
                videoUrl: 'https://www.youtube.com/embed/ByXuk9QqQkk',
                thumbnailUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=300&h=450',
                categories: [categories[5]._id, categories[4]._id], // Animasyon & Macera
                viewCount: 890
            }
        ]);

        console.log('✅ Veritabanı başarıyla örnek verilerle dolduruldu.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Hata oluştu:', err);
        process.exit(1);
    }
}

seed();
