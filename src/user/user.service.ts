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

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    while (true) {
      createdUser._id = uuidV4();
      if (!await this.getById(createdUser._id)) break;
    }
    return createdUser.save();
  }

  getAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  getById(id: string): Promise<User> {
    return this.userModel.findOne({ id }).exec();
  }

  getByLogin(login: string): Promise<User> {
    return this.userModel.findOne({ login }).exec();
  }

  checkPassword(incomingPassword: string, currentPassword: string): Promise<boolean> {
    return compare(incomingPassword, currentPassword);
  }

  async isLoginUnique(login: string): Promise<boolean> {
    return !await this.userModel.findOne({ login });
  }

  async isEmailUnique(email: string): Promise<boolean> {
    return !await this.userModel.findOne({ email });
  }
}
