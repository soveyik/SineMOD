/**
 * Kategori Listesi API'si (app/api/categories/route.ts)
 * 
 * Tüm film kategorilerini getirir. Ana sayfada filtreleme 
 * yapmak için kullanılır.
 */

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';

export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find({});
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ message: 'Kategoriler yüklenemedi.' }, { status: 500 });
  }
}
