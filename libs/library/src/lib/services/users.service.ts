import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async insert(email: string, publicKey: string): Promise<void | never> {
    const existingOne = await this.findOneByEmail(email);
    if (existingOne) {
      throw new ConflictException();
    } else {
      await this.usersRepository.insert({
        email,
        publicKey: Buffer.from(
          '\\x' + Buffer.from(publicKey, 'base64').toString('hex')
        ),
      });
    }
  }
}
