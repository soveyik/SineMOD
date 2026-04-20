/**
 * Kullanıcı Giriş API'si (app/api/auth/login/route.ts)
 * 
 * Bu API, kullanıcı bilgilerini doğrular ve geçerli ise 
 * bir JWT (JSON Web Token) oluşturup tarayıcıya çerez olarak gönderir.
 * 'httpOnly' çerezi sayesinde token JavaScript tarafından okunamaz (XSS koruması).
 */

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'gizli_anahtar_buraya';

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { email, password } = await request.json();

    // Kullanıcıyı veritabanında bul
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: 'Hatalı e-posta veya şifre.' },
        { status: 401 }
      );
    }

    // Şifreyi doğrula
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { message: 'Hatalı e-posta veya şifre.' },
        { status: 401 }
      );
    }

    // JWT Oluştur
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' } // 7 gün geçerli
    );

    // Çerezi ayarla (HttpOnly)
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 gün
      path: '/',
    });

    return NextResponse.json(
      { 
        message: 'Giriş başarılı.',
        user: { name: user.name, role: user.role } 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Giriş hatası:', error);
    return NextResponse.json(
      { message: 'Bir sunucu hatası oluştu.' },
      { status: 500 }
    );
  }
}
