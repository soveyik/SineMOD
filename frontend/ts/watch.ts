/**
 * İzleme Sayfası Mantığı (frontend/ts/watch.ts)
 * 
 * Film detaylarını getirir, videoyu yükler, izlenme sayısını 
 * artırır ve yorum sistemini yönetir.
 */

import { api } from './api';

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');

    if (!movieId) {
        window.location.href = '/';
        return;
    }

    const videoPlayer = document.getElementById('video-player') as HTMLIFrameElement;
    const movieTitle = document.getElementById('movie-title');
    const movieDesc = document.getElementById('movie-desc');
    const movieMeta = document.getElementById('movie-meta');
    const commentForm = document.getElementById('comment-form') as HTMLFormElement;
    const commentList = document.getElementById('comment-list');
    const statusDiv = document.getElementById('comment-status');

    /**
     * Film Detaylarını Yükle ve İzlenme Sayısını Artır
     */
    async function loadMovieDetails() {
        try {
            // API'den tüm filmleri çekip filtreleyebiliriz (şuan için basitlik olsun diye)
            const movies = await api.get('/api/movies');
            const movie = movies.find((m: any) => m._id === movieId);

            if (!movie) throw new Error('Film bulunamadı');

            if (movieTitle) movieTitle.textContent = movie.title;
            if (movieDesc) movieDesc.textContent = movie.description;
            if (movieMeta) movieMeta.textContent = `${movie.viewCount} İzlenme • ${new Date(movie.createdAt).getFullYear()}`;
            if (videoPlayer) videoPlayer.src = movie.videoUrl;

            // İzlenme sayısını artır
            await api.post('/api/movies/view', { movieId });
        } catch (err) {
            console.error('Hata:', err);
        }
    }

    /**
     * Yorumları Yükle
     */
    async function loadComments() {
        if (!commentList) return;
        try {
            const comments = await api.get(`/api/comments?movieId=${movieId}`);
            commentList.innerHTML = '';

            comments.forEach((comment: any) => {
                const isSpoiler = comment.aiStatus === 'spoiler_hidden';
                const commentHTML = `
                    <div class="bg-gray-700 p-4 rounded text-sm border-l-2 ${isSpoiler ? 'border-amber-500' : 'border-blue-500'}">
                        <div class="flex justify-between mb-2">
                            <span class="font-bold text-blue-400">${comment.user.name}</span>
                            <span class="text-xs text-gray-400">${new Date(comment.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div class="comment-body ${isSpoiler ? 'cursor-pointer select-none' : ''}">
                            ${isSpoiler ? '<span class="italic text-gray-500">[SPOILER İÇERİR - GÖRMEK İÇİN TIKLAYIN]</span>' : comment.content}
                        </div>
                        ${isSpoiler ? `<div class="comment-real-content hidden mt-2 text-gray-200">${comment.content}</div>` : ''}
                    </div>
                `;
                commentList.insertAdjacentHTML('beforeend', commentHTML);
            });

            // Spoiler tıklama olayı
            document.querySelectorAll('.comment-body').forEach(el => {
                el.addEventListener('click', () => {
                    const realContent = el.nextElementSibling;
                    if (realContent?.classList.contains('comment-real-content')) {
                        el.classList.add('hidden');
                        realContent.classList.remove('hidden');
                    }
                });
            });
        } catch (err) {
            console.error('Yorumlar yüklenemedi');
        }
    }

    /**
     * Yeni Yorum Gönder
     */
    commentForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!statusDiv) return;

        const content = (document.getElementById('comment-content') as HTMLTextAreaElement).value;
        const isSpoilerByUser = (document.getElementById('is-spoiler') as HTMLInputElement).checked;

        statusDiv.textContent = 'Denetleniyor...';
        statusDiv.className = 'text-sm mt-2 text-blue-400';
        statusDiv.classList.remove('hidden');

        try {
            const result = await api.post('/api/comments', {
                content,
                movieId,
                isSpoilerByUser
            });

            statusDiv.textContent = result.message;
            statusDiv.className = 'text-sm mt-2 text-green-400';
            commentForm.reset();
            loadComments(); // Listeyi yenile
        } catch (err: any) {
            statusDiv.textContent = err.message;
            statusDiv.className = 'text-sm mt-2 text-red-400';
        }
    });

    loadMovieDetails();
    loadComments();
});
