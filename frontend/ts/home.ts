/**
 * Ana Sayfa Mantığı (frontend/ts/home.ts)
 * 
 * Bu dosya, filmleri ve kategorileri dinamik olarak yükler.
 * 'Premium' kart tasarımı ve animasyonlu geçişler içerir.
 */

import { api } from './api';

document.addEventListener('DOMContentLoaded', async () => {
    const movieGrid = document.getElementById('movie-grid');
    const categoryList = document.getElementById('category-list');
    const gridTitle = document.getElementById('grid-title');

    /**
     * Filmleri Yükle ve Render Et
     */
    async function loadMovies(categoryId = '') {
        if (!movieGrid) return;
        
        // Yükleniyor animasyonu veya temizleme
        movieGrid.innerHTML = `
            <div class="col-span-full flex justify-center py-20">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        `;

        try {
            const url = categoryId ? `/api/movies?category=${categoryId}` : '/api/movies';
            const movies = await api.get(url);
            
            movieGrid.innerHTML = '';
            
            if (movies.length === 0) {
                movieGrid.innerHTML = '<p class="col-span-full text-center text-gray-500 py-10 font-bold">Bu kategoride henüz film bulunmuyor.</p>';
                return;
            }

            movies.forEach((movie: any, index: number) => {
                // Kategori isimlerini birleştir
                const categoryNames = movie.categories ? movie.categories.map((c: any) => c.name).join(', ') : '';

                const card = `
                    <a href="/watch?id=${movie._id}" class="movie-card group relative block overflow-hidden rounded-2xl bg-gray-800 ring-1 ring-white/10" style="animation: fadeIn 0.5s ease-out ${index * 0.1}s forwards; opacity: 0;">
                        <!-- Film Afişi -->
                        <div class="aspect-[2/3] w-full overflow-hidden">
                            <img src="${movie.thumbnailUrl || 'https://via.placeholder.com/300x450'}" alt="${movie.title}" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110">
                        </div>
                        
                        <!-- Bilgi Katmanı (Overlay) -->
                        <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                            <div class="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <div class="flex flex-wrap gap-1 mb-2">
                                    ${movie.categories ? movie.categories.map((c: any) => `<span class="bg-blue-600/80 text-[10px] px-2 py-0.5 rounded-full text-white font-bold">${c.name}</span>`).join('') : ''}
                                </div>
                                <h3 class="text-lg font-bold text-white mb-1">${movie.title}</h3>
                                <div class="flex items-center space-x-2 text-xs text-blue-400 font-bold">
                                    <span>${movie.viewCount} İzlenme</span>
                                    <span class="h-1 w-1 rounded-full bg-gray-500"></span>
                                    <span>Şimdi İzle</span>
                                </div>
                            </div>
                        </div>

                        <!-- Alt Bilgi (Her zaman görünür) -->
                        <div class="p-3">
                            <h4 class="font-bold text-sm truncate text-gray-200">${movie.title}</h4>
                            <p class="text-[10px] text-gray-500 truncate">${categoryNames}</p>
                        </div>
                    </a>
                `;
                movieGrid.insertAdjacentHTML('beforeend', card);
            });
        } catch (err) {
            movieGrid.innerHTML = '<p class="text-red-500">Filmler yüklenirken bir hata oluştu.</p>';
        }
    }

    /**
     * Kategorileri Yükle
     */
    async function loadCategories() {
        if (!categoryList) return;
        try {
            const categories = await api.get('/api/categories');
            
            categories.forEach((cat: any) => {
                const btn = document.createElement('button');
                btn.className = 'category-pill glass px-6 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all hover:bg-blue-600 border border-white/5';
                btn.textContent = cat.name;
                btn.dataset.id = cat._id;
                
                btn.addEventListener('click', () => {
                    // Aktif butonu güncelle
                    document.querySelectorAll('.category-pill').forEach(b => b.classList.remove('bg-blue-600', 'active', 'shadow-xl'));
                    btn.classList.add('bg-blue-600', 'active', 'shadow-xl');
                    
                    if (gridTitle) gridTitle.textContent = `${cat.name} Filmleri`;
                    loadMovies(cat._id);
                });
                
                categoryList.appendChild(btn);
            });
        } catch (err) {
            console.error('Kategoriler yüklenemedi');
        }
    }

    loadCategories();
    loadMovies();
});
