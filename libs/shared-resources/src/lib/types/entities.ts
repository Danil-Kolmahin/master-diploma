export interface BaseEntityI {
  id: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ChallengeI extends BaseEntityI {
  body: string;
  expiresAt: Date;
}

export interface InviteI extends ChallengeI {
  email: string;
  projectName: string;
}

export interface ProjectI extends BaseEntityI {
  name: string;
}

export interface NamespaceI extends BaseEntityI {
  name: string;
  projectId: string;
  parentId?: string;
}

export interface SecretI extends BaseEntityI {
  name: string;
  projectId: string;
  namespaceId: string;
  encryptedValue: string;
}

export interface SecurityKeyI extends BaseEntityI {
  userId: string;
  entityId: string;
  encryptedKey: string;
  projectId: string;
}

export interface TraceI extends BaseEntityI {
  userId: string;
  projectId: string;
  url: string;
  method: string;
  body?: string;
  query?: string;
}

export interface UserI extends BaseEntityI {
  email: string;
  publicKey: string;
}
