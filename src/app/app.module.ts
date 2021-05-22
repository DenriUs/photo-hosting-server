import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import AuthModule from 'src/auth/auth.module';
import UserModule from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/photo-hosting'),
    AuthModule,
    UserModule,
  ],
})
export default class AppModule {}
