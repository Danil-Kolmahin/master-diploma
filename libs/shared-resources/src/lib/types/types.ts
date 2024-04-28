export interface CookieOptions {
  secure?: boolean;
  maxAge?: number;
  sameSite?: boolean | 'strict' | 'lax' | 'none';
  httpOnly?: boolean;
}
