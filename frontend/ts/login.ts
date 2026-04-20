/**
 * Giriş Sayfası Mantığı (frontend/ts/login.ts)
 * 
 * Kullanıcının girdiği bilgileri alır, API'ye gönderir 
 * ve başarılı durumda ana sayfaya yönlendirir.
 */

import { api } from './api';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form') as HTMLFormElement;
    const errorDiv = document.getElementById('error-msg');

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = (document.getElementById('email') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;

        try {
            await api.post('/api/auth/login', { email, password });
            
            // Giriş başarılıysa ana sayfaya git
            window.location.href = '/';
        } catch (err: any) {
            if (errorDiv) {
                errorDiv.textContent = err.message;
                errorDiv.classList.remove('hidden');
            }
        }
    });
});
