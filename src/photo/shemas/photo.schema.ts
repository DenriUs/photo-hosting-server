import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

@Schema()
export class Photo {
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

  @Prop({ type: String, ref: 'User' })
  authorId: User;
}

export type PhotoDocument = Photo & Document;

export const PhotoSchema = SchemaFactory.createForClass(Photo);
