/**
 * Kayıt Sayfası Mantığı (frontend/ts/register.ts)
 * 
 * Form verilerini alır, backend kayıt API'sine gönderir 
 * ve kullanıcıya sonucu bildirir.
 */

import { api } from './api';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('register-form') as HTMLFormElement;
    const statusDiv = document.getElementById('status-msg');

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = (document.getElementById('name') as HTMLInputElement).value;
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;

        try {
            const result = await api.post('/api/auth/register', { name, email, password });
            
            if (statusDiv) {
                statusDiv.textContent = result.message + ' Giriş sayfasına yönlendiriliyorsunuz...';
                statusDiv.className = 'text-green-500 text-sm mt-2';
                statusDiv.classList.remove('hidden');
            }

            // 2 saniye sonra giriş sayfasına yönlendir
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);

        } catch (err: any) {
            if (statusDiv) {
                statusDiv.textContent = err.message;
                statusDiv.className = 'text-red-500 text-sm mt-2';
                statusDiv.classList.remove('hidden');
            }
        }
    });
});
