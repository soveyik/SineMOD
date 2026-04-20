/**
 * Ana Uygulama Mantığı (frontend/ts/app.ts)
 * 
 * Tüm sayfalarda ortak olan temel kontrolleri (Auth kontrolü gibi) 
 * ve evrensel değişkenleri yönetir.
 */

import { api } from './api';

// Kullanıcı durumu tipi
export interface UserState {
    name: string;
    role: 'admin' | 'user';
}

class App {
    user: UserState | null = null;

    constructor() {
        this.init();
    }

    async init() {
        try {
            // Sayfa yüklendiğinde oturum bilgisini tazele
            const data = await api.get('/api/auth/me');
            this.user = data.user;
            this.updateNavbar();
        } catch (err) {
            this.user = null;
            this.updateNavbar();
        }
    }

    /**
     * Navbar'ı (Gezinti çubuğunu) kullanıcı durumuna göre günceller
     */
    updateNavbar() {
        const navRight = document.getElementById('nav-right');
        if (!navRight) return;

        if (this.user) {
            navRight.innerHTML = `
                <span class="text-sm font-medium mr-4">Merhaba, ${this.user.name}</span>
                ${this.user.role === 'admin' ? '<a href="/admin" class="hover:text-blue-500 mr-4">Yönetim</a>' : ''}
                <button id="logout-btn" class="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600">Çıkış</button>
            `;
            
            document.getElementById('logout-btn')?.addEventListener('click', () => this.logout());
        } else {
            navRight.innerHTML = `
                <a href="/login" class="mr-4 hover:text-blue-500">Giriş Yap</a>
                <a href="/register" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Kayıt Ol</a>
            `;
        }
    }

    async logout() {
        await fetch('/api/auth/logout', { method: 'POST' }); // Henüz yazmadık ama ekleyeceğiz
        window.location.href = '/login';
    }
}

// Global uygulama nesnesi
export const app = new App();
