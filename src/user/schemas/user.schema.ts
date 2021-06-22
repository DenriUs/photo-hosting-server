import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Photo } from 'src/photo/shemas/photo.schema';

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

  @Prop()
  resetCode: string;

  @Prop()
  resetCodeLastCreationTime: number;

  @Prop()
  profilePhotoUrl: string;

  @Prop()
  backgroundPhotoUrl: string;

  @Prop([{ type: String, ref: 'Photo' }])
  favoritePhotoIds: Photo[];

  @Prop([{ type: String, ref: 'Photo' }])
  accessedPhotoIds: Photo[];
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
