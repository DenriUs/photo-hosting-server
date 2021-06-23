import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ForAuthorized } from '../auth/auth.decorators';
import { CommentDocument } from './shemas/comment.schema';
import CommentService from './comment.service';
import AddCommentDto from './dto/add-comment.dto';

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

  @Post('addComment')
  public async addComment(
    @Body() addCommentDto: AddCommentDto,
  ): Promise<CommentDocument> {
    const { _id } = await this.commentService.add(addCommentDto);
    return await this.commentService.getById(_id);
  }
}
