import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

@Schema()
export class Photo {
  @Prop()
  hostUrl: string;

  @Prop()
  creationTimestamp: number;

  @Prop()
  creationLatitude?: string;

  @Prop()
  creationLongitude?: string;

  @Prop({ type: String, ref: 'User' })
  authorId: User;
}

export type PhotoDocument = Photo & Document;

export const PhotoSchema = SchemaFactory.createForClass(Photo);
