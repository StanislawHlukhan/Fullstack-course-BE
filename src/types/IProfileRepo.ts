import { Profile } from './Profile';

export interface IProfileRepo {
  getProfileBySubId(subId: string): Promise<Profile | null>;
  createProfile(data: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>, tx?: unknown): Promise<Profile>;
}