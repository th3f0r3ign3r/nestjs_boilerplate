import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from 'src/lib/dto';
import { ParseIdPipe } from 'src/lib/pipes';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'src/lib/entities';
import { User } from 'src/lib/schema';
import { ArraySerializeUser, serializeUser } from 'src/lib/types';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    if ((await this.userModel.exists({ email: createUserDto.email })) !== null)
      throw new HttpException(
        'USER.ERROR.EMAIL_ALREADY_EXIST',
        HttpStatus.CONFLICT,
      );
    else if (
      (await this.userModel.exists({ username: createUserDto.username })) !==
      null
    )
      throw new HttpException(
        'USER.ERROR.USERNAME_ALREADY_EXIST',
        HttpStatus.CONFLICT,
      );
    else {
      const password = bcrypt.hashSync(
        createUserDto.password,
        bcrypt.genSaltSync(parseInt(process.env.SALT_ROUNDS)),
      );
      const user = this.userModel.create({
        ...createUserDto,
        password,
      });
      if (!user)
        throw new HttpException(
          'USER.ERROR.USER_NOT_CREATED',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      else
        return {
          response: 'User successfully created',
        };
    }
  }

  async findAll() {
    return { response: ArraySerializeUser(await this.userModel.find()) };
  }

  async checkAvailability(payload: { id: ParseIdPipe; query: object }) {
    const count = await this.userModel
      .find(payload.query)
      .where('_id')
      .ne(payload.id)
      .count()
      .exec();
    return count ? { response: true } : { response: false };
  }

  async findById(id: ParseIdPipe) {
    return { response: serializeUser(await this.userModel.findById(id)) };
  }

  async findOne(query: any) {
    return await this.userModel.findOne(query);
  }

  async update(id: ParseIdPipe, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findByIdAndUpdate(id, {
      firstname: updateUserDto?.firstname,
      lastname: updateUserDto?.lastname,
      email: updateUserDto?.email,
      city: updateUserDto?.city,
      country: updateUserDto?.country,
      phone: updateUserDto?.phone,
      address: updateUserDto?.address,
      birthdate: updateUserDto?.birthdate,
      updatedAt: new Date(),
    });
    if (!user)
      throw new HttpException(
        'USER.ERROR.USER_NOT_FOUND',
        HttpStatus.NOT_FOUND,
      );
    else return { response: 'User successfully updated' };
  }

  async remove(id: ParseIdPipe) {
    const user = await this.userModel.findByIdAndDelete(id).exec();
    if (!user)
      throw new HttpException(
        'USER.ERROR.USER_NOT_FOUND',
        HttpStatus.NOT_FOUND,
      );
    else return { response: 'User successfully removed' };
  }
}
