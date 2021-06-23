import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import CommentController from './comment.controller';
import CommentService from './comment.service';
import { Comment, CommentSchema } from './shemas/comment.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }])],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export default class CommentModule {}
