import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PhotoController } from './photo.controller';
import { PhotoService } from './photo.service';
import { Photo, PhotoSchema } from './shemas/photo.schema';
import AzureStorageModule from '../azure-storage/azure-storage.module';
import UserModule from 'src/user/user.module';

@Module({
  imports: [
    AzureStorageModule,
    forwardRef(() => UserModule),
    MongooseModule.forFeature([{ name: Photo.name, schema: PhotoSchema }]),
  ],
  controllers: [PhotoController],
  providers: [PhotoService],
  exports: [PhotoService],
})
export default class PhotoModule {}
