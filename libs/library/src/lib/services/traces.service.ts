import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trace } from '../entities/trace.entity';

@Injectable()
export class TracesService {
  constructor(
    @InjectRepository(Trace)
    private readonly tracesRepository: Repository<Trace>
  ) {}

  findByProjectId(projectId: string): Promise<Trace[]> {
    return this.tracesRepository.findBy({ projectId });
  }

  async insert(
    userId: string,
    projectId: string,
    url: string,
    method: string,
    body?: string,
    query?: string
  ): Promise<void | never> {
    await this.tracesRepository.insert({
      userId,
      projectId,
      url,
      method,
      body,
      query,
    });
  }
}
