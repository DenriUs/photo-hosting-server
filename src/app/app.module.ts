import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import AuthModule from '../auth/auth.module';
import UserModule from '../user/user.module';
import envConfig from '../config/environment';
import AzureStorageModule from '../azure-storage/azure-storage.module';
import PhotoModule from '../photo/photo.module';
import EmailModule from 'src/email/email.module';

@Module({
  imports: [
    MongooseModule.forRoot(envConfig.dbConnectionString),
    AuthModule,
    UserModule,
    AzureStorageModule,
    PhotoModule,
    EmailModule,
  ],
})
export default class AppModule {}
