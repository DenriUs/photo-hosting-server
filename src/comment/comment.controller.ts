import { Controller, Get, Param } from '@nestjs/common';
import { ForAuthorized } from '../auth/auth.decorators';
import { CommentDocument } from './shemas/comment.schema';
import CommentService from './comment.service';

@ForAuthorized()
@Controller('comment')
export default class CommentController {
  constructor(
    private readonly commentService: CommentService,
  ) {}

  @Get('getComments/:photoId')
  public async getCurrentUserData(
    @Param('photoId') photoId,
  ): Promise<CommentDocument[]> {
    return await this.commentService.getAllByPhotoId(photoId);
  }
}
