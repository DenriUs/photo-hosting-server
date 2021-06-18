import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidV4 } from 'uuid';
import { User, UserDocument } from './schemas/user.schema';
import CreateUserDto from './dto/create-user.dto';
import { compare } from 'bcrypt';

@Injectable()
export default class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  public async getUniqueUuidByParameter(parameter: 'userId' | 'azureStorageName') {
    let uuid = '';
    while (true) {
      uuid = uuidV4();
      const getAction = parameter === 'userId' ? this.getById : this.getByAzureStorageContainerName;
      if (!await getAction(uuid)) break;
    }
    return uuid;
  }

  public async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const createdUser = new this.userModel(createUserDto);
    createdUser._id = await this.getUniqueUuidByParameter('userId');
    return createdUser.save();
  }

  public getAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  public getById(id: string): Promise<UserDocument> {
    return this.userModel.findOne({ _id: id }).exec();
  }

  public getByAzureStorageContainerName(name: string): Promise<UserDocument> {
    return this.userModel.findOne({ azureStorageContainerName: name }).exec();
  }

  public getByLogin(login: string): Promise<UserDocument> {
    return this.userModel.findOne({ login }).exec();
  }

  public checkPassword(incomingPassword: string, currentPassword: string): Promise<boolean> {
    return compare(incomingPassword, currentPassword);
  }

  public async checkIsLoginUnique(login: string): Promise<boolean> {
    return !await this.userModel.findOne({ login });
  }

  public async checkIsEmailUnique(email: string): Promise<boolean> {
    return !await this.userModel.findOne({ email });
  }
}
