import { IdentityUser } from './IdentityUser';

export interface IIdentityService {
  getUserByAccessToken(token: string): Promise<IdentityUser>;
  createUser(email: string, name: string): Promise<IdentityUser>;
  setPassword(subId: string, password: string): Promise<void>;
}