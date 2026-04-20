/**
 * Kullanıcı Kayıt API'si (app/api/auth/register/route.ts)
 * 
 * Bu API, yeni kullanıcıların sisteme kayıt olmasını sağlar.
 * Gelen şifreyi bcryptjs kütüphanesi ile hash'leyerek veritabanına kaydeder.
 */

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    // Veritabanına bağlan
    await dbConnect();

    // İstek gövdesinden (body) verileri al
    const { name, email, password } = await request.json();

    // Kullanıcının sistemde zaten var olup olmadığını kontrol et
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'Bu e-posta adresi zaten kullanımda.' },
        { status: 400 }
      );
    }

    // Şifreyi hash'le (Güvenlik için)
    const hashedPassword = await bcrypt.hash(password, 12);

    // Yeni kullanıcıyı oluştur
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: 'user', // Varsayılan olarak normal kullanıcı rolü
    });

    await newUser.save();

    return NextResponse.json(
      { message: 'Kullanıcı başarıyla oluşturuldu.' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Kayıt hatası:', error);
    return NextResponse.json(
      { message: 'Bir sunucu hatası oluştu.' },
      { status: 500 }
    );
  }
}
