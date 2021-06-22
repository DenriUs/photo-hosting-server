import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import AzureStorageModule from 'src/azure-storage/azure-storage.module';
import PhotoModule from 'src/photo/photo.module';
import { User, UserSchema } from './schemas/user.schema';
import UserController from './user.controller';
import UserService from './user.service';

@Module({
  imports: [
    AzureStorageModule,
    PhotoModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export default class UserModule {}
