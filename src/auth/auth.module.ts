import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import AuthController from './auth.controller';
import JwtStrategy from './jwt.strategy';
import AuthService from './auth.service';
import UserModule from '../user/user.module';
import envConfig from '../config/environment';
import AzureStorageModule from '../azure-storage/azure-storage.module';

@Module({
  imports: [
    UserModule,
    AzureStorageModule,
    PassportModule,
    JwtModule.register({
      secret: envConfig.jwtSecret || 'SECRET',
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export default class AuthModule {}
