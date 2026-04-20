# -*- coding: utf-8 -*-
"""
AI Eğitim Betiği (ai/train.py)

Bu dosya, Python ve scikit-learn kullanarak film yorumlarını analiz eden
yerel bir NLP (Doğal Dil İşleme) modeli eğitir. 
Modelimiz iki ana görevi yerine getirir:
1. Küfür/Toksisite Kontrolü
2. Spoiler Kontrolü
"""

import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
import os

# Eğitim Verisi (Örnek Set)
# Gerçek bir projede bu veri seti binlerce satır olmalıdır.
X_train = [
    # Normal Yorumlar
    "çok güzel bir film olmuş", "oyunculuklar harika", "kesinlikle tavsiye ederim",
    "görsel efektler büyüleyiciydi", "duygusal bir hikaye", "sinemada izlenmeli",
    
    # Toksik / Küfürlü Yorumlar
    "berbat bir yapım rezalet", "nefret ettim iğrenç sakın izlemeyin",
    "salakça bir senaryo zaman kaybı", "bok gibi bir film", "aptalca bir son",
    
    # Spoiler İçeren Yorumlar
    "sonunda ana karakter ölüyor", "katil aslında şu kişiymiş öğrendim",
    "meğer hepsi rüyaymış sonu çok şaşırtıcı", "final sahnesinde bombayı patlatıyor",
    "aslında arkadaşı ona ihanet ediyormuş spoiler"
]

# Etiketler: 0 = Normal, 1 = Toksik, 2 = Spoiler
y_train = [
    0, 0, 0, 0, 0, 0, # Normal
    1, 1, 1, 1, 1,    # Toksik
    2, 2, 2, 2, 2     # Spoiler
]

def train_model():
    print("Model egitimi başlatılıyor...")
    
    # Pipeline oluşturma: Metni vektöre çevir ve Naive Bayes ile sınıflandır
    model_pipeline = Pipeline([
        ('tfidf', TfidfVectorizer()),
        ('clf', MultinomialNB())
    ])
    
    # Modeli eğit
    model_pipeline.fit(X_train, y_train)
    
    # Modeli dosyaya kaydet
    model_path = os.path.join(os.path.dirname(__file__), 'model.joblib')
    joblib.dump(model_pipeline, model_path)
    
    print(f"Model basariyla egitildi ve kaydedildi: {model_path}")

if __name__ == "__main__":
    train_model()
