export interface CookieOptions {
  secure?: boolean;
  maxAge?: number;
  sameSite?: boolean | 'strict' | 'lax' | 'none';
  httpOnly?: boolean;
}

export interface AuthDataI {
  sub: string;
  projectId: string;
  email: string;
  projectName: string;
  iat: number;
  exp: number;
}
