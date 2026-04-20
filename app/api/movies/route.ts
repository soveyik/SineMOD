/**
 * Film Listeleme API'si (app/api/movies/route.ts)
 * 
 * Veritabanındaki filmleri listeleyen ana API'dir.
 * Eğer URL içerisinde 'category' parametresi varsa sadece o kategoriye 
 * ait filmleri döner.
 */

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Movie from '@/models/Movie';
import Category from '@/models/Category'; // 'populate' için bu gerekli

export async function GET(request: Request) {
  try {
    await dbConnect();
    
    // URL parametrelerini al
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category');
    
    let query = {};
    if (categoryId && categoryId !== 'null' && categoryId !== 'undefined') {
      query = { categories: categoryId };
    }

    // Filmleri getir ve kategorilerini doldur
    const movies = await Movie.find(query)
      .populate('categories')
      .sort({ createdAt: -1 }); // En yeniler en üstte
      
    return NextResponse.json(movies);
  } catch (error: any) {
    console.error('Film listeleme hatası:', error.message);
    return NextResponse.json({ 
        message: 'Filmler yüklenemedi.', 
        error: error.message 
    }, { status: 500 });
  }
}
