import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Photo } from 'src/photo/shemas/photo.shema';

@Schema()
export class User {
  @Prop()
  _id: string;

  @Prop()
  login: string;

  @Prop()
  password: string;

  @Prop()
  email: string;

  @Prop()
  azureStorageContainerName: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Photo' })
  photos: Photo[];
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
