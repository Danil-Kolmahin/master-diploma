import { ACCESS_TIME } from '../constants/constants';
import { CookieOptions } from '../types/types';

export const COOKIE_OPTIONS: CookieOptions = {
  maxAge: ACCESS_TIME,
  sameSite: 'strict',
  httpOnly: true,
};
