import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PhotoController } from './photo.controller';
import { PhotoService } from './photo.service';
import { Photo, PhotoSchema } from './shemas/photo.shema';
import AzureStorageModule from '../azureStorage/azureStorage.module';

@Module({
  imports: [
    AzureStorageModule,
    MongooseModule.forFeature([{ name: Photo.name, schema: PhotoSchema }]),
  ],
  controllers: [PhotoController],
  providers: [PhotoService],
  exports: [PhotoService],
})
export default class PhotoModule {}