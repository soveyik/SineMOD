/**
 * Admin Film Yönetim API'si (app/api/admin/movies/route.ts)
 * 
 * Yöneticilerin sisteme yeni film eklemesini sağlar.
 */

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Movie from '@/models/Movie';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();

    const { title, description, videoUrl, thumbnailUrl, categories } = data;

    if (!title || !videoUrl) {
      return NextResponse.json({ message: 'Başlık ve Video URL zorunludur.' }, { status: 400 });
    }

    const newMovie = new Movie({
      title,
      description,
      videoUrl,
      thumbnailUrl,
      categories // Kategori ID'leri dizisi
    });

    await newMovie.save();

    return NextResponse.json({ message: 'Film başarıyla eklendi.', movie: newMovie }, { status: 201 });
  } catch (error) {
    console.error('Film ekleme hatası:', error);
    return NextResponse.json({ message: 'Film eklenirken bir hata oluştu.' }, { status: 500 });
  }
}

/**
 * Mevcut filmleri admin için listeleme
 */
export async function GET() {
    try {
        await dbConnect();
        const movies = await Movie.find({}).populate('categories').sort({ createdAt: -1 });
        return NextResponse.json(movies);
    } catch (error) {
        return NextResponse.json({ message: 'Filmler alınamadı.' }, { status: 500 });
    }
}
