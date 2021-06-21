import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidV4 } from 'uuid';
import { User, UserDocument } from './schemas/user.schema';
import CreateUserDto from './dto/create-user.dto';
import { compare } from 'bcrypt';
import AddFavoriteDto from '../photo/dto/add-favorite.dto';

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

  public async addFavorite(
    addFavorite: AddFavoriteDto,
  ): Promise<UserDocument> {
    return this.userModel.findOneAndUpdate(
      { _id: addFavorite.userId },
      { $addToSet: { favoritePhotos: [addFavorite.favoritePhotoId] } },
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
