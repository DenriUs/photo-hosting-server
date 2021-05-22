import { Controller } from '@nestjs/common';
import UserService from './user.service';
import { ForAuthorized } from '../auth/auth.decorators';

@ForAuthorized()
@Controller('user')
export default class UserController {
  constructor(private readonly userService: UserService) {}
}
