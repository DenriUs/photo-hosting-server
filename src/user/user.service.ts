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

  public async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const createdUser = new this.userModel(createUserDto);
    while (true) {
      createdUser._id = uuidV4();
      if (!await this.getById(createdUser._id)) break;
    }
    return createdUser.save();
  }

  public getAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  public getById(id: string): Promise<UserDocument> {
    return this.userModel.findOne({ _id: id }).exec();
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
