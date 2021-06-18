import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
