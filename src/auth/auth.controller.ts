import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import AuthService from './auth.service';
import UserService from '../user/user.service';
import CreateUserDto from '../user/dto/create-user.dto';
import AuthorizeUserDto from '../user/dto/authorize-user.dto';
import { ForAuthorized } from './auth.decorators';

@Controller('auth')
export default class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  async login(@Body() authorizeUserDto: AuthorizeUserDto): Promise<{ accessToken: string }> {
    if (!authorizeUserDto.login || !authorizeUserDto.password) {
      throw new BadRequestException();
    }
    const user = await this.userService.getByLogin(authorizeUserDto.login);
    if (!user || !await this.userService.checkPassword(authorizeUserDto.password, user.password)) {
      throw new BadRequestException('Неправильний логін або пароль');
    }
    return { accessToken: await this.authService.login(user) };
  }

  @Post('register')
  async register(@Body() user: CreateUserDto): Promise<void> {
    await this.verifyRegistrationData(user);
    await this.authService.register(user);
  }

  @ForAuthorized()
  @Get('checkAuthStatus')
  checkAuthStatus() {
    return;
  }

  private async verifyRegistrationData(createUserDto: CreateUserDto) {
    if (!await this.userService.isLoginUnique(createUserDto.login)) {
      throw new BadRequestException(`Логін: ${createUserDto.login} вже зайнятий`);
    }
    if (!await this.userService.isEmailUnique(createUserDto.email)) {
      throw new BadRequestException(`Email: ${createUserDto.email} вже зайнятий`);
    }
  }
}
