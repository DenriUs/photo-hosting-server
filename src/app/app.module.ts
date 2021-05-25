import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import AuthModule from '../auth/auth.module';
import UserModule from '../user/user.module';
import envConfig from '../config/environment';

@Module({
  imports: [
    MongooseModule.forRoot(envConfig.dbConnectionString),
    AuthModule,
    UserModule,
  ],
})
export default class AppModule {}
