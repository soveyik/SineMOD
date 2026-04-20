/**
 * Admin Paneli Mantığı (frontend/ts/admin.ts)
 * 
 * Bu dosya, yönetim panelindeki tüm etkileşimleri yönetir.
 * - İstatistikleri API'den çeker.
 * - Chart.js kütüphanesi ile grafikler oluşturur.
 * - Film listesini yönetir.
 * - Yeni film ekleme formunu kontrol eder.
 */

import { api } from './api';

// Chart.js global değişkeni (HTML'de CDN ile yüklendi)
declare var Chart: any;

document.addEventListener('DOMContentLoaded', () => {
    const adminMovieList = document.getElementById('admin-movie-list');
    const addMovieForm = document.getElementById('add-movie-form') as HTMLFormElement;
    const addModal = document.getElementById('add-modal');
    const showAddModalBtn = document.getElementById('show-add-modal');
    const closeModalBtn = document.getElementById('close-modal');

    /**
     * İstatistikleri Yükle ve Grafik Oluştur
     */
    async function loadStats() {
        try {
            const data = await api.get('/api/admin/stats');
            const { stats, topMovies } = data;

            // Kartları doldur
            if (document.getElementById('stat-users')) document.getElementById('stat-users')!.textContent = stats.users;
            if (document.getElementById('stat-movies')) document.getElementById('stat-movies')!.textContent = stats.movies;
            if (document.getElementById('stat-views')) document.getElementById('stat-views')!.textContent = stats.views;
            if (document.getElementById('stat-comments')) document.getElementById('stat-comments')!.textContent = stats.comments;

            // Grafik Oluştur (Chart.js)
            const ctx = document.getElementById('pop-chart') as HTMLCanvasElement;
            if (ctx) {
                new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: topMovies.map((m: any) => m.title),
                        datasets: [{
                            label: 'İzlenme Sayısı',
                            data: topMovies.map((m: any) => m.viewCount),
                            backgroundColor: '#3b82f6',
                            borderRadius: 5
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                            y: { beginAtZero: true, grid: { color: '#374151' } },
                            x: { grid: { display: false } }
                        }
                    }
                });
            }
        } catch (err) {
            console.error('İstatistikler yüklenemedi');
        }
    }

    /**
     * Admin Film Listesini Yükle
     */
    async function loadMovies() {
        if (!adminMovieList) return;
        try {
            const movies = await api.get('/api/admin/movies');
            adminMovieList.innerHTML = '';
            
            movies.forEach((movie: any) => {
                const row = `
                    <tr>
                        <td class="px-6 py-4 font-medium">${movie.title}</td>
                        <td class="px-6 py-4 text-gray-400">
                            ${movie.categories.map((c: any) => c.name).join(', ')}
                        </td>
                        <td class="px-6 py-4">${movie.viewCount}</td>
                        <td class="px-6 py-4 text-gray-400">${new Date(movie.createdAt).toLocaleDateString()}</td>
                    </tr>
                `;
                adminMovieList.insertAdjacentHTML('beforeend', row);
            });
        } catch (err) {
            console.error('Filmler yüklenemedi');
        }
    }

    /**
     * Yeni Film Kaydet
     */
    addMovieForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const movieData = {
            title: (document.getElementById('add-title') as HTMLInputElement).value,
            videoUrl: (document.getElementById('add-video-url') as HTMLInputElement).value,
            thumbnailUrl: (document.getElementById('add-thumb-url') as HTMLInputElement).value,
            description: (document.getElementById('add-desc') as HTMLTextAreaElement).value,
            categories: [] // Şimdilik boş, kategori seçimi eklenebilir
        };

        try {
            await api.post('/api/admin/movies', movieData);
            alert('Film başarıyla eklendi!');
            addModal?.classList.add('hidden');
            addMovieForm.reset();
            loadMovies();
            loadStats();
        } catch (err: any) {
            alert('Hata: ' + err.message);
        }
    });

    // Modal Kontrolleri
    showAddModalBtn?.addEventListener('click', () => addModal?.classList.remove('hidden'));
    closeModalBtn?.addEventListener('click', () => addModal?.classList.add('hidden'));
    document.getElementById('admin-logout')?.addEventListener('click', () => {
        fetch('/api/auth/logout', { method: 'POST' }).then(() => window.location.href = '/login');
    });

    loadStats();
    loadMovies();
});
