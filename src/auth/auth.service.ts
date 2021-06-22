import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcrypt';
import { UserDocument } from '../user/schemas/user.schema';
import UserService from '../user/user.service';
import CreateUserDto from '../user/dto/create-user.dto';
import EmailService from 'src/email/email.service';

@Injectable()
export default class AuthService {
  private readonly hashRounds = 10;

  private readonly resetCodeLenght = 5;

  private readonly resetCodeMinutes = 5;

  private readonly resetCodeValidTime = this.resetCodeMinutes * 60 * 1000;

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly emailService: EmailService,
  ) {}

  public login(user: UserDocument): Promise<string> {
    const payload = {
      login: user.login,
      password: user.password,
    };
    return this.jwtService.signAsync(payload);
  }

  public async register(createUserDto: CreateUserDto): Promise<void> {
    createUserDto.password = await hash(
      createUserDto.password,
      this.hashRounds,
    );
    await this.userService.create(createUserDto);
  }

  public async generateResetPasswordCode(user: UserDocument): Promise<void> {
    const resetCode = this.generateRandomString(this.resetCodeLenght);
    user.resetCode = resetCode;
    user.resetCodeLastCreationTime = new Date().getTime();
    await this.userService.update(user);
    await this.emailService.sendEmailAsync(
      user.email,
      'Відновлення паролю',
      user.login,
      resetCode,
    );
  }

  public async verifyIsResetCodeAlreadyExpired(
    user: UserDocument,
  ): Promise<void> {
    if (
      new Date(
        user.resetCodeLastCreationTime + this.resetCodeValidTime,
      ).getTime() < new Date().getTime()
    ) {
      throw new BadRequestException('Ваш код вже недійсний');
    }
  }

  public async resetPassword(
    user: UserDocument,
    newPassword: string,
  ): Promise<void> {
    user.password = await hash(newPassword, this.hashRounds);
    user.resetCode = '';
    this.userService.update(user);
  }

  private generateRandomString(stringLenght: number): string {
    const result: string[] = [];
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < stringLenght; i++) {
      result.push(
        characters.charAt(Math.floor(Math.random() * characters.length)),
      );
    }
    return result.join('');
  }
}
