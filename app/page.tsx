/**
 * Ana Sayfa Yönlendiricisi (app/page.tsx)
 * 
 * Bu dosya, kullanıcı localhost:3000 adresine girdiğinde 
 * onları hazırladığımız 'public/index.html' tasarımına yönlendirir.
 * Eğer bu dosya olmazsa Next.js API rotalarıyla karışıklık yaşayabilir.
 */

import { redirect } from 'next/navigation';

export default function Home() {
  // Kullanıcıyı statik HTML tasarımımıza yönlendir (Rewrites ile uyumlu çalışır)
  return null; 
}

// Sunucu tarafında ana sayfa isteği geldiğinde public/index.html'in 
// rewrites üzerinden gelmesini bekliyoruz. Ancak bir karışıklık olmaması için
// bu dosyayı boş bir bileşen olarak tutuyoruz.
