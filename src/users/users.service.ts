import {
  HttpException,
  HttpStatus,
  Injectable,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from 'src/lib/dto';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'src/lib/entities';
import { User } from 'src/lib/schema';

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
    return await this.userModel.find();
  }

  async checkAvailability(payload: { uuid: ParseUUIDPipe; query: object }) {
    const count = await this.userModel
      .find(payload.query)
      .where('uuid')
      .ne(payload.uuid)
      .count()
      .exec();
    return count ? { response: true } : { response: false };
  }

  async findByUuid(uuid: ParseUUIDPipe) {
    return await this.userModel.findOne({ uuid });
  }

  async findOne(query: any) {
    return await this.userModel.findOne(query);
  }

  async update(uuid: ParseUUIDPipe, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findOneAndUpdate(
      { uuid },
      {
        firstname: updateUserDto?.firstname,
        lastname: updateUserDto?.lastname,
        email: updateUserDto?.email,
        city: updateUserDto?.city,
        country: updateUserDto?.country,
        phone: updateUserDto?.phone,
        address: updateUserDto?.address,
        birthdate: updateUserDto?.birthdate,
        updatedAt: new Date(),
      },
    );
    if (!user)
      throw new HttpException(
        'USER.ERROR.USER_NOT_FOUND',
        HttpStatus.NOT_FOUND,
      );
    else return { response: 'User successfully updated' };
  }

  async remove(uuid: ParseUUIDPipe) {
    const user = await this.userModel.findOneAndDelete({ uuid }).exec();
    if (!user)
      throw new HttpException(
        'USER.ERROR.USER_NOT_FOUND',
        HttpStatus.NOT_FOUND,
      );
    else return { response: 'User successfully removed' };
  }
}
