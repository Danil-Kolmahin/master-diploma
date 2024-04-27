import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';

import { Invite } from '../entities/invite.entity';

@Injectable()
export class InvitesService {
  constructor(
    @InjectRepository(Invite)
    private readonly invitesRepository: Repository<Invite>
  ) {}

  findOneByBEP(
    body: string,
    email: string,
    projectName: string
  ): Promise<Invite | null> {
    return this.invitesRepository.findOne({
      where: {
        body,
        email,
        projectName,
        expiresAt: MoreThan(new Date()),
      },
    });
  }

  async insert(
    body: string,
    email: string,
    projectName: string
  ): Promise<void | never> {
    await this.invitesRepository.insert({
      body,
      email,
      projectName,
      expiresAt: new Date(new Date().getTime() + 5 * 60 * 1000),
    });
  }

  async delete(email: string, projectName: string): Promise<void | never> {
    await this.invitesRepository.delete({
      email,
      projectName,
    });
  }
}
