import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcrypt';
import { User } from '../user/schemas/user.schema';
import UserService from '../user/user.service';
import CreateUserDto from '../user/dto/create-user.dto';

@Injectable()
export default class AuthService {
  private readonly hashRounds = 10;

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  login(user: User): Promise<string> {
    const payload = {
      id: user._id,
      login: user.login,
      password: user.password,
    }
    return this.jwtService.signAsync(payload);
  }

  async register(createUserDto: CreateUserDto): Promise<void> {
    createUserDto.password = await hash(createUserDto.password, this.hashRounds);
    await this.userService.create(createUserDto);
  }
}
