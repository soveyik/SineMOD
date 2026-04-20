/**
 * Yorum Gönderme ve Yerel AI Denetim API'si (app/api/comments/route.ts)
 * 
 * Bu API, kullanıcılardan gelen yorumları alır ve kaydetmeden önce 
 * yerel Python AI modeli üzerinden denetler:
 * 1. Küfür/Hakaret Kontrolü (Yerel Python ML Modeli)
 * 2. Spoiler Kontrolü (Yerel Python ML Modeli)
 */

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Comment from '@/models/Comment';
import { localAI } from '@/ai/classifier';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'gizli_anahtar_buraya';

export async function POST(request: Request) {
  try {
    await dbConnect();

    // 1. Kullanıcı oturumunu kontrol et
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Lütfen giriş yapın.' }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    const { content, movieId, isSpoilerByUser } = await request.json();

    // 2. Yerel AI Modeli ile Analiz (Küfür ve Spoiler)
    const { isToxic, isSpoiler } = await localAI.analyze(content);

    // Eğer küfür/toksisite varsa engelle
    if (isToxic) {
      return NextResponse.json(
        { message: 'Yorumunuz topluluk kurallarını ihlal ediyor (Toksik içerik tespit edildi).' },
        { status: 400 }
      );
    }

    // 3. Spoiler Durumunu Belirle
    let aiStatus: 'approved' | 'spoiler_hidden' = 'approved';
    
    // Kullanıcı işaretlemişse veya AI spoiler bulmuşsa gizle
    if (isSpoilerByUser || isSpoiler) {
      aiStatus = 'spoiler_hidden';
    }

    // 4. Yorumu kaydet
    const newComment = new Comment({
      content,
      user: userId,
      movie: movieId,
      isSpoilerByUser,
      aiStatus,
    });

    await newComment.save();

    return NextResponse.json(
      { 
        message: aiStatus === 'spoiler_hidden' 
          ? 'Yorumunuz spoiler içerdiği için gizlenerek kaydedildi.' 
          : 'Yorumunuz başarıyla yayınlandı.',
        comment: newComment 
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Yorum API hatası:', error);
    return NextResponse.json(
      { message: 'Yorum gönderilirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}

/**
 * Belirli bir film için yorumları getirme (GET)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get('movieId');

    if (!movieId) {
      return NextResponse.json({ message: 'Film ID gerekli.' }, { status: 400 });
    }

    await dbConnect();
    const comments = await Comment.find({ movie: movieId, aiStatus: { $ne: 'toxic' } })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json({ message: 'Yorumlar yüklenemedi.' }, { status: 500 });
  }
}
