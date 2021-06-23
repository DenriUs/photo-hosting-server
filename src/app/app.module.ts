import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import AuthModule from '../auth/auth.module';
import UserModule from '../user/user.module';
import envConfig from '../config/environment';
import AzureStorageModule from '../azure-storage/azure-storage.module';
import PhotoModule from '../photo/photo.module';
import EmailModule from 'src/email/email.module';
import CommentModule from 'src/comment/comment.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../shared'),
    }),
    MongooseModule.forRoot(envConfig.dbConnectionString),
    AuthModule,
    UserModule,
    AzureStorageModule,
    PhotoModule,
    EmailModule,
    CommentModule,
  ],
})
export default class AppModule {}
