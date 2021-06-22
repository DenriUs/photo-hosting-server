import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentDocument } from './shemas/comment.schema';

@Injectable()
export default class CommentService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<CommentDocument>,
  ) {}

  public getAllByPhotoId(photoId: string): Promise<CommentDocument[]> {
    return this.commentModel.find().where('photoId').equals(photoId).populate('authorId').exec();
  }
}
