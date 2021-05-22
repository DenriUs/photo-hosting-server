import { IsEmail, MinLength } from "class-validator";

export default class CreateUserDto {
  readonly login: string;
  @MinLength(8)
  @IsEmail()
  readonly email: string;
  password: string;
}
