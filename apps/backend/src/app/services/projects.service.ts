import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Project } from '../entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>
  ) {}

  findOneByName(name: string): Promise<Project | null> {
    return this.projectsRepository.findOneBy({ name });
  }

  async insert(name: string): Promise<void | never> {
    const existingOne = await this.findOneByName(name);
    if (existingOne) throw new ConflictException();

    await this.projectsRepository.insert({ name });
  }
}
