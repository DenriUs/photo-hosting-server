import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Photo } from 'src/photo/shemas/photo.schema';
import { User } from 'src/user/schemas/user.schema';

@Schema()
export class Comment {
  @Prop()
  id: string;

  @Prop()
  creationDate: string;

  @Prop()
  text: string;

  @Prop({ type: String, ref: 'Photo' })
  photoId: Photo;

  @Prop({ type: String, ref: 'User' })
  authorId: User;
}

export type CommentDocument = Comment & Document;

export const CommentSchema = SchemaFactory.createForClass(Comment);
