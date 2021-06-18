import { Module } from '@nestjs/common';
import AzureStorageService from './azureStorage.service';

@Module({
  providers: [AzureStorageService],
  exports: [AzureStorageService],
})
export default class AzureStorageModule {}
