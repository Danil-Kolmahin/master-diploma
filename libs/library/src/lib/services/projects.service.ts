import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Project } from '../entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>
  ) {}

  findOneByNameAndUserId(
    name: string,
    userId: string
  ): Promise<Project | null> {
    return this.projectsRepository.findOneBy({ name, createdBy: userId });
  }

  async insert(name: string, userId: string): Promise<void | never> {
    const existingOne = await this.projectsRepository.findOneBy({
      createdBy: userId,
    });
    if (existingOne) {
      throw new ConflictException();
    } else {
      await this.projectsRepository.insert({
        name,
        createdBy: userId,
      });
    }
  }
}
