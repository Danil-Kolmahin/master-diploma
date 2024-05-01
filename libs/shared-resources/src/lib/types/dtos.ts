import { NamespaceI, UserI } from './entities';

export interface NewNamespaceDtoI {
  name: string;
  parentId?: string;
  encryptedSecurityKey: string;
}

export interface RoleContentDtoI {
  policies: string[][];
}

export interface AddRoleDtoI extends RoleContentDtoI {
  roleName: string;
}

export interface ChangeUserRoleDtoI {
  userId: string;
  roleName: string;
  entities: EntitiesToReEncryptDtoI[];
}

export interface EntitiesToReEncryptDtoI {
  encryptedSecurityKey: string;
  entityId: string;
}

export interface CreateSecretDtoI {
  name: string;
  encryptedValue: string;
  namespaceId: string;
}

export interface NewUserDtoI {
  email: string;
  projectName: string;
}

export interface SignInAndVerifyChallengeDtoI extends NewUserDtoI {
  challenge: string;
}

export interface SignUpDtoI extends NewUserDtoI {
  publicKey: string;
}

export interface MembersDtoI extends UserI {
  roleName: string;
}

export interface NamespaceDtoI extends NamespaceI {
  encryptedSecurityKey: string;
}
