/**
 * Güvenlik Ara Katmanı (middleware.ts)
 * 
 * Bu dosya, her HTTP isteği sunucuya ulaşmadan önce çalışır.
 * Amacı:
 * 1. Admin sayfalarına/API'lerine yetkisiz girişi engellemek.
 * 2. Giriş yapmamış kullanıcıları login sayfasına yönlendirmek (isteğe bağlı).
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';
import * as jose from 'jose'; // Sunucusuz ortamda JWT kontrolü için jose kütüphanesi daha uygundur

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'gizli_anahtar_buraya');

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // 1. Admin Rotası Kontrolü (Sayfa veya API)
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Token'ı doğrula
      const { payload } = await jose.jwtVerify(token, JWT_SECRET);
      
      // Eğer kullanıcı admin değilse, ana sayfaya at
      if (payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (err) {
      // Geçersiz token durumunda girişe yönlendir
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Diğer isteklerin devam etmesine izin ver
  return NextResponse.next();
}

// Middleware'in hangi yollarda çalışacağını seç
export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
