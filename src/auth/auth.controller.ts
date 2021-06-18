import { BadRequestException, Body, Controller, Get, InternalServerErrorException, Post } from '@nestjs/common';
import AuthService from './auth.service';
import UserService from '../user/user.service';
import CreateUserDto from '../user/dto/create-user.dto';
import AuthorizeUserDto from '../user/dto/authorize-user.dto';
import { ForAuthorized } from './auth.decorators';
import AzureStorageService from 'src/azureStorage/azureStorage.service';

@Controller('auth')
export default class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly azureStorageService: AzureStorageService,
  ) {}

  @Post('login')
  public async login(@Body() authorizeUserDto: AuthorizeUserDto): Promise<{ accessToken: string }> {
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
  public async register(@Body() user: CreateUserDto): Promise<void> {
    await this.verifyRegistrationData(user);
    const uuid = await this.userService.getUniqueUuidByParameter('azureStorageName');
    const isContainerCreated = await this.azureStorageService.tryCreateContainer(uuid);
    if (!isContainerCreated) {
      throw new InternalServerErrorException();
    }
    user.azureStorageContainerName = uuid;
    await this.authService.register(user);
  }

  @ForAuthorized()
  @Get('checkAuthStatus')
  public checkAuthStatus() {
    return;
  }

  private async verifyRegistrationData(createUserDto: CreateUserDto) {
    if (!await this.userService.checkIsLoginUnique(createUserDto.login)) {
      throw new BadRequestException(`Логін ${createUserDto.login} вже зайнятий`);
    }
    if (!await this.userService.checkIsEmailUnique(createUserDto.email)) {
      throw new BadRequestException(`Email ${createUserDto.email} вже зайнятий`);
    }
  }
}
