/**
 * Admin İstatistik API'si (app/api/admin/stats/route.ts)
 * 
 * Yönetim panelindeki grafikler ve özet bilgiler için veritabanındaki 
 * toplam rakamları (kullanıcı sayısı, film sayısı vb.) hesaplar.
 */

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Movie from '@/models/Movie';
import Comment from '@/models/Comment';

export async function GET() {
  try {
    await dbConnect();

    // Paralel olarak tüm sayımları yap (Performans için)
    const [userCount, movieCount, commentCount, movies] = await Promise.all([
      User.countDocuments(),
      Movie.countDocuments(),
      Comment.countDocuments(),
      Movie.find({}).select('title viewCount').sort({ viewCount: -1 }).limit(10)
    ]);

    // Toplam izlenme sayısını hesapla
    const totalViews = movies.reduce((acc, curr) => acc + (curr.viewCount || 0), 0);

    return NextResponse.json({
      stats: {
        users: userCount,
        movies: movieCount,
        comments: commentCount,
        views: totalViews
      },
      topMovies: movies // En çok izlenen 10 film (Grafik için)
    });
  } catch (error) {
    return NextResponse.json({ message: 'İstatistikler alınamadı.' }, { status: 500 });
  }
}
