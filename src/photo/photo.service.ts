import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import CreatePhotoDto from './dto/create-photo.dto';
import UpdatePhotoDto from './dto/update-photo.dto';
import { Photo, PhotoDocument } from './shemas/photo.schema';

@Injectable()
export class PhotoService {
  constructor(
    @InjectModel(Photo.name) private readonly photoModel: Model<PhotoDocument>,
  ) {}

  public async create(createPhotoDto: CreatePhotoDto): Promise<PhotoDocument> {
    const newPhoto = new this.photoModel({
      authorId: createPhotoDto.authorId,
      originalName: createPhotoDto.originalName,
      hostUrl: createPhotoDto.hostUrl,
      ...createPhotoDto.exif,
    });
    return await newPhoto.save();
  }

  public async getById(id: string): Promise<PhotoDocument> {
    return this.photoModel.findById(id);
  } 

  public async getAllByUserId(id: string): Promise<PhotoDocument[]> {
    return this.photoModel.find().where('authorId').equals(id).exec();
  }

  public async update(updatePhotoDto: UpdatePhotoDto): Promise<PhotoDocument> {
    return this.photoModel.findOneAndUpdate({ _id: updatePhotoDto.id }, { ...updatePhotoDto });
  }
}
