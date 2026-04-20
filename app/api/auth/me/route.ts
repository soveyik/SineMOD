/**
 * Kullanıcı Bilgisi API'si (app/api/auth/me/route.ts)
 * 
 * Tarayıcıdaki 'token' çerezini okur, geçerli olup olmadığını 
 * kontrol eder ve kullanıcı bilgilerini döner.
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'gizli_anahtar_buraya';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Yetkisiz erişim.' }, { status: 401 });
    }

    // Token'ı doğrula
    const decoded: any = jwt.verify(token, JWT_SECRET);
    
    await dbConnect();
    const user = await User.findById(decoded.userId).select('-password'); // Şifreyi gönderme!

    if (!user) {
      return NextResponse.json({ message: 'Kullanıcı bulunamadı.' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ message: 'Geçersiz token.' }, { status: 401 });
  }
}
