/**
 * API Yardımcı Dosyası (frontend/ts/api.ts)
 * 
 * Bu dosya, backend servislerine (API) atılacak HTTP isteklerini 
 * standart hale getirir. Tüm fetch işlemleri buradan yönetilir.
 */

export const api = {
    /**
     * GET İstekleri için
     */
    async get(url: string) {
        const response = await fetch(url);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Bir hata oluştu.');
        }
        return response.json();
    },

    /**
     * POST İstekleri için
     */
    async post(url: string, data: any) {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || 'Bir hata oluştu.');
        }
        return result;
    }
};
