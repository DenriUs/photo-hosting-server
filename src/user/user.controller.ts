import { Controller, Get } from '@nestjs/common';
import UserService from './user.service';
import { ForAuthorized, GetUser } from '../auth/auth.decorators';
import { UserDocument } from './schemas/user.schema';

@ForAuthorized()
@Controller('user')
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('getCurrentUserData')
  public async getCurrentUserData(
    @GetUser() currentUser: UserDocument,
  ): Promise<Partial<UserDocument>> {
    const { id, login, email, favoritePhotoIds } = currentUser;
    return { id, login, email, favoritePhotoIds };
  }
}
