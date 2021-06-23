import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from './shemas/comment.schema';

@Injectable()
export default class CommentService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<CommentDocument>,
  ) {}

  public async getAllByPhotoId(photoId: string): Promise<CommentDocument[]> {
    return this.commentModel.find().where('photoId').equals(photoId).populate('authorId', 'login profilePhotoUrl').exec();
  }

  public async getById(id: string): Promise<CommentDocument> {
    return this.commentModel.findOne().where('_id').equals(id).populate('authorId', 'login profilePhotoUrl').exec();
  }

  public add(addCommentDto): Promise<CommentDocument> {
    const newComment = new this.commentModel(addCommentDto);
    return newComment.save();
  }
}
