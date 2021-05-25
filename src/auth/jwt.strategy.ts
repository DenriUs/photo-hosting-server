import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import UserService from '../user/user.service';
import { UserDocument } from '../user/schemas/user.schema';
import envConfig from '../config/environment';

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: envConfig.jwtSecret || 'SECRET',
    });
  }

  async validate(payload: any): Promise<UserDocument> {
    const user = await this.userService.getByLogin(payload.login);
    if (!user || user.password !== payload.password) {
      throw new UnauthorizedException(); 
    }
    return user;
  }
}
