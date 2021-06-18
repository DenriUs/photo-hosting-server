import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import CreatePhotoDto from './dto/create-photo.dto';
import { Photo, PhotoDocument } from './shemas/photo.schema';

@Injectable()
export class PhotoService {
  constructor(
    @InjectModel(Photo.name) private readonly photoModel: Model<PhotoDocument>,
  ) {}

  public async create(createPhotoDto: CreatePhotoDto): Promise<PhotoDocument> {
    const newPhoto = new this.photoModel(createPhotoDto);
    return newPhoto.save();
  }

  public async getAllByUserId(id: string): Promise<PhotoDocument[]> {
    return this.photoModel.find().where('authorId').equals(id).exec();
  }
}
