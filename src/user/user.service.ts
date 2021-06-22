import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidV4 } from 'uuid';
import { User, UserDocument } from './schemas/user.schema';
import CreateUserDto from './dto/create-user.dto';
import { compare } from 'bcrypt';
import FavoritePhotoDto from '../photo/dto/favorite-photo.dto';
import { Photo } from 'src/photo/shemas/photo.schema';
import UpdateUserDto from './dto/update-user.dto';
import AccessedPhotoDto from 'src/photo/dto/accessed-photo.dto';

@Injectable()
export default class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  public async getUniqueUuidByParameter(
    parameter: 'userId' | 'azureStorageName',
  ) {
    let uuid = '';
    while (true) {
      uuid = uuidV4();
      if (
        !(await (parameter === 'userId'
          ? this.getById(uuid)
          : this.getByAzureStorageContainerName(uuid)))
      )
        break;
    }
    return uuid;
  }

  public async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const newUser = new this.userModel(createUserDto);
    newUser._id = await this.getUniqueUuidByParameter('userId');
    return newUser.save();
  }

  public getAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  public getById(id: string): Promise<UserDocument | undefined> {
    return this.userModel.findOne({ _id: id }).exec();
  }

  public getByAzureStorageContainerName(
    name: string,
  ): Promise<UserDocument | undefined> {
    return this.userModel.findOne({ azureStorageContainerName: name }).exec();
  }

  public getByLogin(login: string): Promise<UserDocument | undefined> {
    return this.userModel.findOne({ login }).exec();
  }

  public getByEmail(email: string): Promise<UserDocument | undefined> {
    return this.userModel.findOne({ email }).exec();
  }

  public getAllByLoginPart(
    loginPart: string,
  ): Promise<UserDocument[] | undefined> {
    return this.userModel
      .find({ login: { $regex: loginPart, $options: 'i' } })
      .exec();
  }

  public async getAllFavoriteByUserId(id: string): Promise<Photo[]> {
    return (
      await this.userModel
        .findOne({ _id: id })
        .populate('favoritePhotoIds')
        .exec()
    ).favoritePhotoIds;
  }

  public async getAllAccessedByUserId(id: string): Promise<Photo[]> {
    return (
      await this.userModel
        .findOne({ _id: id })
        .populate('accessedPhotoIds')
        .exec()
    ).accessedPhotoIds;
  }

  public async update(user: UserDocument): Promise<UserDocument> {
    return this.userModel.findOneAndUpdate({ _id: user.id }, user);
  }

  public async addFavorite(
    addFavorite: FavoritePhotoDto,
  ): Promise<UserDocument> {
    return this.userModel.findOneAndUpdate(
      { _id: addFavorite.userId },
      { $addToSet: { favoritePhotoIds: [addFavorite.favoritePhotoId] } },
    );
  }

  public async addAccessed(
    addAccessed: AccessedPhotoDto,
  ): Promise<UserDocument> {
    return this.userModel.findOneAndUpdate(
      { _id: addAccessed.userId },
      { $addToSet: { accessedPhotoIds: [addAccessed.accessedPhotoId] } },
    );
  }

  public async removeFavorite(
    addFavorite: FavoritePhotoDto,
  ): Promise<UserDocument> {
    return this.userModel.findOneAndUpdate(
      { _id: addFavorite.userId },
      { $pull: { favoritePhotoIds: addFavorite.favoritePhotoId } },
    );
  }

  public checkPassword(
    incomingPassword: string,
    currentPassword: string,
  ): Promise<boolean> {
    return compare(incomingPassword, currentPassword);
  }

  public async checkIsLoginUnique(login: string): Promise<boolean> {
    return !(await this.userModel.findOne({ login }));
  }

  public async checkIsEmailUnique(email: string): Promise<boolean> {
    return !(await this.userModel.findOne({ email }));
  }
}
