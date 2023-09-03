import { User } from '@prisma/client';

export class UserDTO implements User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export class CreateUserDTO
  implements Omit<UserDTO, 'id' | 'createdAt' | 'updatedAt'>
{
  name: string;
  email: string;
}
