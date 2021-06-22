import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'src/user/schemas/user.schema';
import CreatePhotoDto from './dto/create-photo.dto';
import { ExifDto } from './dto/exif.dto';
import UpdatePhotoDto from './dto/update-photo.dto';
import { Photo, PhotoDocument } from './shemas/photo.schema';

@Injectable()
export default class PhotoService {
  constructor(
    @InjectModel(Photo.name) private readonly photoModel: Model<PhotoDocument>,
  ) {}

  public async create(createPhotoDto: CreatePhotoDto): Promise<PhotoDocument> {
    const newPhoto = new this.photoModel({
      authorId: createPhotoDto.authorId,
      authorLogin: createPhotoDto.authorLogin,
      originalName: createPhotoDto.originalName,
      hostUrl: createPhotoDto.hostUrl,
      ...createPhotoDto.exif,
    });
    return await newPhoto.save();
  }

  public async getById(id: string): Promise<PhotoDocument> {
    return this.photoModel.findById(id);
  }

  public async getAllOwnByUserId(id: string): Promise<PhotoDocument[]> {
    return this.photoModel
      .find()
      .where('authorId')
      .equals(id)
      .exec();
  }

  public async makeShared(id: string): Promise<PhotoDocument> {
    return this.photoModel.findOneAndUpdate({ _id: id }, { isShared: true }, { new: true });
  }

  public async update(updatePhotoDto: UpdatePhotoDto): Promise<PhotoDocument> {
    return this.photoModel.findOneAndUpdate(
      { _id: updatePhotoDto.id },
      { ...updatePhotoDto },
      { new: true },
    );
  }

  public preparePhotoToSave(
    author: UserDocument,
    photo: Express.Multer.File,
    photoContainer: string,
    exifData?: ExifDto,
  ): CreatePhotoDto {
    const newPhoto = new CreatePhotoDto();
    newPhoto.authorId = author.id;
    newPhoto.authorLogin = author.login;
    newPhoto.originalName = photo.originalname;
    newPhoto.hostUrl = `${photoContainer}/${photo.originalname}`;
    if (exifData) {
      const parsedExifData = JSON.parse(JSON.stringify(exifData));
      for (const exifField of Object.keys(parsedExifData)) {
        if (parsedExifData[exifField] === 'undefined') {
          parsedExifData[exifField] = null;
        }
      }
      newPhoto.exif = parsedExifData;
      if (!newPhoto.exif) {
        newPhoto.exif.creationDate = new Date().toISOString();
      }
    }
    return newPhoto;
  }
}
