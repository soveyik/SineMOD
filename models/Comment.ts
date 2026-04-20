/**
 * Yorum Modeli (models/Comment.ts)
 * 
 * Filmlerin altına yazılan kullanıcı yorumlarını temsil eder.
 * Yapay zeka denetimi sonucunda 'toksik' veya 'spoiler' olarak işaretlenebilir.
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  content: string; // Yorum metni
  user: mongoose.Types.ObjectId; // Yorumu yazan kullanıcı
  movie: mongoose.Types.ObjectId; // Yorumun yapıldığı film
  isSpoilerByUser: boolean; // Kullanıcının kendisinin işaretlediği spoiler durumu
  aiStatus: 'pending' | 'approved' | 'toxic' | 'spoiler_hidden'; // Yapay zeka denetim durumu
}

const CommentSchema: Schema = new Schema({
  content: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  movie: { type: Schema.Types.ObjectId, ref: 'Movie', required: true },
  isSpoilerByUser: { type: Boolean, default: false },
  aiStatus: { 
    type: String, 
    enum: ['pending', 'approved', 'toxic', 'spoiler_hidden'], 
    default: 'pending' 
  },
}, { timestamps: true });

export default mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);
