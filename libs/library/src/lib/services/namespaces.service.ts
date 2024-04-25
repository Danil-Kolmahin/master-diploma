import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Namespace } from '../entities/namespace.entity';

@Injectable()
export class NamespacesService {
  constructor(
    @InjectRepository(Namespace)
    private readonly namespacesRepository: Repository<Namespace>
  ) {}

  findByProjectId(projectId: string): Promise<Namespace[]> {
    return this.namespacesRepository.find({ where: { projectId } });
  }

  findOne(name: string, projectId: string): Promise<Namespace | null> {
    return this.namespacesRepository.findOneBy({ name, projectId });
  }

  async insert(
    name: string,
    projectId: string,
    parentId?: string
  ): Promise<void | never> {
    await this.namespacesRepository.insert({ name, projectId, parentId });
  }
}
