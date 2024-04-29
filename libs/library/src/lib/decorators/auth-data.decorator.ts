import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { AuthDataI } from '@master-diploma/shared-resources';

export const AuthData = createParamDecorator(
  (_, context: ExecutionContext): AuthDataI => {
    const request = context.switchToHttp().getRequest();
    return request.authData as AuthDataI;
  }
);
