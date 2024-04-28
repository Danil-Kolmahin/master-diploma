import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { ACCESS_TIME } from '@master-diploma/shared-resources';
import { Challenge } from '../entities/challenge.entity';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectRepository(Challenge)
    private readonly challengesRepository: Repository<Challenge>
  ) {}

  findOneByBody(body: string): Promise<Challenge | null> {
    return this.challengesRepository.findOne({
      where: { body, expiresAt: MoreThan(new Date()) },
    });
  }

  async insert(body: string): Promise<void | never> {
    await this.challengesRepository.insert({
      body,
      expiresAt: new Date(new Date().getTime() + ACCESS_TIME),
    });
  }

  async delete(body: string): Promise<void | never> {
    await this.challengesRepository.delete({ body });
  }
}
