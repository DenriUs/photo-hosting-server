import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import AuthModule from '../auth/auth.module';
import UserModule from '../user/user.module';
import envConfig from '../config/environment';
import AzureStorageModule from 'src/azureStorage/azureStorage.module';
import PhotoModule from 'src/photo/photo.module';

@Module({
  imports: [
    MongooseModule.forRoot(envConfig.dbConnectionString),
    AuthModule,
    UserModule,
    AzureStorageModule,
    PhotoModule,
  ],
})
export default class AppModule {}
