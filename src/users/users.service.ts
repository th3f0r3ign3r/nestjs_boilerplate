import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from 'src/lib/dto';
import { ParseIdPipe } from 'src/lib/pipes';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'src/lib/entities';
import { User } from 'src/schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    if ((await this.userModel.exists({ email: createUserDto.email })) !== null)
      throw new HttpException(
        'USER.ERROR_EMAIL_ALREADY_EXIST',
        HttpStatus.CONFLICT,
      );
    else if (
      (await this.userModel.exists({ username: createUserDto.username })) !==
      null
    )
      throw new HttpException(
        'USER.ERROR_USERNAME_ALREADY_EXIST',
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
          'USER.ERROR_USER_NOT_CREATED',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      else
        return {
          response: 'User successfully created',
        };
    }
  }

  async findAll() {
    return { response: await this.userModel.find() };
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

  async findOne(id: ParseIdPipe) {
    return { response: await this.userModel.findById(id) };
  }

  async update(id: ParseIdPipe, updateUserDto: UpdateUserDto) {
    await this.userModel.findByIdAndUpdate(id, {
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
    return { response: 'User successfully updated' };
  }

  async remove(id: ParseIdPipe) {
    await this.userModel.findByIdAndDelete(id).exec();
    return { response: 'User successfully removed' };
  }
}
