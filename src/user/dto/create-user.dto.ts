import { IsEmail, MinLength } from "class-validator";

export default class CreateUserDto {
  readonly login: string;
  @MinLength(8, { message: 'Мінімальна довжина паролю - 8 символів' })
  @IsEmail({}, { message: 'Введіть коректний email' })
  readonly email: string;
  password: string;
  azureStorageContainerName?: string;
}
