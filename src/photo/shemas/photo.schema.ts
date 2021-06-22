import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from '../../user/schemas/user.schema';
import { Comment } from '../../comment/shemas/comment.schema'

@Schema()
export class Photo {
  @Prop()
  id: string;

  @Prop()
  originalName: string;

  @Prop()
  hostUrl: string;

  @Prop()
  creationDate: string;

  @Prop()
  width: number;

  @Prop()
  height: number;

  @Prop()
  latitude: number;

  @Prop()
  longitude: number;

  @Prop()
  cameraModel: string;
  
  @Prop()
  apertureValue: number;

  @Prop()
  exposureTime: number;

  @Prop()
  focalLenght: number;
  
  @Prop()
  iso: number;

  @Prop()
  isShared: boolean;

  @Prop()
  authorLogin: string;

  @Prop({ type: String, ref: 'User' })
  authorId: User;

  @Prop([{ type: String, ref: 'Comment' }])
  commentIds: Comment;
}

export type PhotoDocument = Photo & Document;

export const PhotoSchema = SchemaFactory.createForClass(Photo);
