import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  //create user
  async createUser(email: string, password: string): Promise<string> {
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });
    await newUser.save();
    return 'User registered successfully!';
  }

  //get all users
  async getAllUsers(): Promise<User[]> {
    return this.userModel.find().exec(); // Retrieve all users from the database
  }

  //login
  async login(email: string, password: string): Promise<string> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    return 'Login successful!'; // You might want to return a token or user data in a real application
  }
}
