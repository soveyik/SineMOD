/**
 * İzlenme Sayısı Artırma API'si (app/api/movies/view/route.ts)
 * 
 * Sınıf diyagramındaki 'increaseViewCount()' fonksiyonunu temsil eder.
 * Belirli bir film ID'si için veritabanındaki viewCount alanını 1 artırır.
 */

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Movie from '@/models/Movie';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { movieId } = await request.json();

    if (!movieId) {
      return NextResponse.json({ message: 'Film ID gerekli.' }, { status: 400 });
    }

    // Veritabanında izlenme sayısını ($inc) operatörü ile artır
    const updatedMovie = await Movie.findByIdAndUpdate(
      movieId,
      { $inc: { viewCount: 1 } },
      { new: true }
    );

    if (!updatedMovie) {
      return NextResponse.json({ message: 'Film bulunamadı.' }, { status: 404 });
    }

    return NextResponse.json({ viewCount: updatedMovie.viewCount });
  } catch (error) {
    console.error('İzlenme artırma hatası:', error);
    return NextResponse.json({ message: 'Bir hata oluştu.' }, { status: 500 });
  }
}
