import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SecurityKey } from '../entities/security-key.entity';

@Injectable()
export class SecurityKeysService {
  constructor(
    @InjectRepository(SecurityKey)
    private readonly securityKeysRepository: Repository<SecurityKey>
  ) {}

  findByProjectId(userId: string, projectId: string): Promise<SecurityKey[]> {
    return this.securityKeysRepository.findBy({
      userId,
      projectId,
    });
  }

  findOne(
    userId: string,
    projectId: string,
    entityId: string
  ): Promise<SecurityKey | null> {
    return this.securityKeysRepository.findOneBy({
      userId,
      projectId,
      entityId,
    });
  }

  async deleteAllUserKeys(userId: string, projectId: string): Promise<void> {
    await this.securityKeysRepository.delete({
      userId,
      projectId,
    });
  }

  async insert(
    userId: string,
    projectId: string,
    entityId: string,
    encryptedKey: string
  ): Promise<void | never> {
    await this.securityKeysRepository.insert({
      userId,
      projectId,
      entityId,
      encryptedKey,
    });
  }
}
