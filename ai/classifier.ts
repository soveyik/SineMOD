/**
 * Yerel AI Sınıflandırıcı (ai/classifier.ts)
 * 
 * Bu dosya, ai/predict.py Python scriptini çağırarak metin analizi yapar.
 * Python tarafında eğitilen ML modelini (model.joblib) kullanarak 
 * yorumların toksik mi yoksa spoiler mı olduğunu tespit eder.
 */

import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

class LocalAI {
    private modelPath: string;

    constructor() {
        this.modelPath = path.join(process.cwd(), 'ai/model.joblib');
        this.checkModel();
    }

    private checkModel() {
        if (!fs.existsSync(this.modelPath)) {
            console.warn('⚠️ AI model dosyası (model.joblib) bulunamadı. Lütfen "npm run ai:train" komutunu çalıştırın.');
        } else {
            console.log('✅ Yerel Python AI Modeli kullanıma hazır.');
        }
    }

    /**
     * Python scriptini çağırarak metni analiz et
     */
    public async analyze(text: string): Promise<{ isToxic: boolean, isSpoiler: boolean }> {
        return new Promise((resolve) => {
            // Python scriptini başlat (Argüman olarak metni gönder)
            // Not: Windows'ta 'python', diğerlerinde 'python3' gerekebilir.
            const pythonProcess = spawn('python', [path.join(process.cwd(), 'ai/predict.py'), text]);

            let output = '';
            let error = '';

            pythonProcess.stdout.on('data', (data) => {
                output += data.toString();
            });

            pythonProcess.stderr.on('data', (data) => {
                error += data.toString();
            });

            pythonProcess.on('close', (code) => {
                if (code !== 0 || error) {
                    console.error('AI Analiz Hatası:', error || `Kod: ${code}`);
                    resolve({ isToxic: false, isSpoiler: false });
                    return;
                }

                try {
                    // Python'dan gelen JSON çıktısını ayrıştır
                    const result = JSON.parse(output.trim());
                    resolve({
                        isToxic: result.isToxic === 1,
                        isSpoiler: result.isSpoiler === 1
                    });
                } catch (e) {
                    console.error('AI Çıktı Ayrıştırma Hatası:', e);
                    resolve({ isToxic: false, isSpoiler: false });
                }
            });
        });
    }
}

export const localAI = new LocalAI();
