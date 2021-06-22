import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import CommentService from './comment.service';
import { Comment, CommentSchema } from './shemas/comment.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }])],
  providers: [CommentService],
  exports: [CommentService],
})
export default class CommentModule {}
