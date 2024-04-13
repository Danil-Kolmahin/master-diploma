import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';

import { Challenge } from '../entities/challenge.entity';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectRepository(Challenge)
    private challengesRepository: Repository<Challenge>
  ) {}

  findOneByBodyAndUserId(
    body: string,
    userId: string
  ): Promise<Challenge | null> {
    return this.challengesRepository.findOne({
      where: {
        body,
        createdBy: userId,
        expiresAt: MoreThan(new Date()),
      },
    });
  }

  async insert(body: string, userId: string): Promise<void | never> {
    await this.challengesRepository.insert({
      body,
      createdBy: userId,
      expiresAt: new Date(new Date().getTime() + 5 * 60 * 1000),
    });
  }

  async delete(body: string, userId: string): Promise<void | never> {
    await this.challengesRepository.delete({
      body,
      createdBy: userId,
    });
  }
}
