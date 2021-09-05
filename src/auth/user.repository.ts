import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const user = new User();
    user.username = username;
    user.password = await bcrypt.hash(password, 10);

    try {
      await user.save();
    } catch (error) {
      switch (error.code) {
        case 'ER_DUP_ENTRY':
          throw new ConflictException('Username already exists');
        default:
          throw new InternalServerErrorException();
      }
    }
  }
}
