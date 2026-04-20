import type { NextConfig } from "next";

/**
 * Next.js Yapılandırma Dosyası
 * Bu dosya, uygulamanın yönlendirme ve diğer sunucu taraflı ayarlarını içerir.
 * Burada, isteklere göre public klasöründeki statik HTML dosyalarını sunmak için 'rewrites' kullanıyoruz.
 */
const nextConfig: NextConfig = {
  async rewrites() {
    return {
      // Dosya sistemi kontrol edilmeden önce yapılacak yönlendirmeler
      beforeFiles: [
        {
          source: "/",
          destination: "/index.html",
        },
        {
          source: "/watch",
          destination: "/watch.html",
        },
        {
          source: "/admin",
          destination: "/admin.html",
        },
        {
          source: "/login",
          destination: "/login.html",
        },
        {
          source: "/register",
          destination: "/register.html",
        },
      ],
    };
  },
};

export default nextConfig;
