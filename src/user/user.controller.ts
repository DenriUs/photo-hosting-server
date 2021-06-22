import { Controller, Get, Param } from '@nestjs/common';
import UserService from './user.service';
import { ForAuthorized, GetUser } from '../auth/auth.decorators';
import { UserDocument } from './schemas/user.schema';
import { Photo } from 'src/photo/shemas/photo.schema';

@ForAuthorized()
@Controller('user')
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('getCurrentUserData')
  public async getCurrentUserData(
    @GetUser() currentUser: UserDocument,
  ): Promise<UserDocument> {
    return await this.userService.getCurrentUserById(currentUser.id);
  }

  @Get('searchToSharePhoto/:photoId/:loginPart')
  public async searchToSharePhoto(
    @GetUser() currentUser,
    @Param('photoId') photoId: Photo,
    @Param('loginPart') loginPart: string,
  ): Promise<UserDocument[]> {
    const users = await this.userService.getAllByLoginPart(loginPart);
    return users.filter(
      user =>
        user._id !== currentUser._id &&
        user.accessedPhotoIds.indexOf(photoId) === -1
      );
  }
}
