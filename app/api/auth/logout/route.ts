/**
 * Çıkış API'si (app/api/auth/logout/route.ts)
 * 
 * Tarayıcıdaki 'token' çerezini silerek oturumu sonlandırır.
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set('token', '', { expires: new Date(0), path: '/' }); // Çerezi geçersiz kıl
  
  return NextResponse.json({ message: 'Çıkış yapıldı.' });
}
