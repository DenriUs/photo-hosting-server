import { Module } from '@nestjs/common';
import AzureStorageModule from 'src/azureStorage/azureStorage.module';
import { PhotoController } from './photo.controller';
import { PhotoService } from './photo.service';

@Module({
  imports: [AzureStorageModule],
  controllers: [PhotoController],
  providers: [PhotoService],
  exports: [PhotoService],
})
export default class PhotoModule {}
