import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Secret } from '../entities/secret.entity';

@Injectable()
export class SecretsService {
  constructor(
    @InjectRepository(Secret)
    private readonly secretsRepository: Repository<Secret>
  ) {}

  getAllSecrets(projectId: string): Promise<Secret[]> {
    return this.secretsRepository.findBy({ projectId });
  }

  findByNamespaceId(namespaceId: string): Promise<Secret[]> {
    return this.secretsRepository.findBy({ namespaceId });
  }

  async insert(
    name: string,
    encryptedValue: string,
    projectId: string,
    namespaceId: string
  ): Promise<void | never> {
    await this.secretsRepository.insert({
      name,
      encryptedValue,
      projectId,
      namespaceId,
    });
  }
}
