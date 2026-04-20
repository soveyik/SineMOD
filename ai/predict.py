# -*- coding: utf-8 -*-
"""
AI Tahmin Betiği (ai/predict.py)

Bu dosya, eğitilen model.joblib dosyasını yükler ve kendisine
argüman olarak gönderilen yorum metnini analiz eder.
"""

import joblib
import sys
import json
import os

def predict(text):
    try:
        # Modeli yükle
        model_path = os.path.join(os.path.dirname(__file__), 'model.joblib')
        if not os.path.exists(model_path):
            return {"error": "Model dosyası bulunamadı. Lütfen önce eğitimi çalıştırın."}
        
        model = joblib.load(model_path)
        
        # Tahmin yap
        # [0] = Normal, [1] = Toksik, [2] = Spoiler
        prediction = model.predict([text])[0]
        
        return {
            "isToxic": int(prediction == 1),
            "isSpoiler": int(prediction == 2)
        }
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    # Komut satırı argümanı olarak metni al
    if len(sys.argv) > 1:
        comment_text = sys.argv[1]
        result = predict(comment_text)
        # Sadece JSON çıktısı ver (Node.js tarafından okunması için)
        print(json.dumps(result))
    else:
        print(json.dumps({"error": "Metin argümanı eksik."}))
